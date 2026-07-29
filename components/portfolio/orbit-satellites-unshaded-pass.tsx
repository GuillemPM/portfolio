"use client"

import { forwardRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three"
import {
  createBcPlaceholderTexture,
  type OrbitSatelliteConfig,
} from "./hero-orbit-satellites"

type SatelliteRuntime = {
  config: OrbitSatelliteConfig
  group: Group
  angle: number
  material: MeshBasicMaterial
}

/**
 * Satellite meshes as children of an anchor group.
 * Only handles mesh creation and orbital animation.
 * The parent controls visibility for multi-pass rendering.
 */
export const SatellitesInScene = forwardRef<Group, {
  items: OrbitSatelliteConfig[]
  modelPosition: [number, number, number]
}>(function SatellitesInScene({ items, modelPosition }, ref) {
  const { gl, camera } = useThree()
  const internalRef = useRef<Group>(null)
  const runtimeRef = useRef<SatelliteRuntime[]>([])

  // Merge refs
  const setRef = (node: Group | null) => {
    internalRef.current = node
    if (typeof ref === "function") ref(node)
    else if (ref) (ref as React.MutableRefObject<Group | null>).current = node
  }

  useEffect(() => {
    const anchor = internalRef.current
    if (!anchor) return

    const loader = new TextureLoader()
    const maxAniso = gl.capabilities.getMaxAnisotropy()

    const created: SatelliteRuntime[] = items.map((config) => {
      const map: Texture = config.imageSrc
        ? loader.load(config.imageSrc, (tex) => {
            tex.colorSpace = SRGBColorSpace
            tex.anisotropy = maxAniso
            tex.generateMipmaps = true
            tex.needsUpdate = true
          })
        : createBcPlaceholderTexture()

      const worldSize = config.scale
      const mat = new MeshBasicMaterial({
        map,
        transparent: true,
        alphaTest: 0.08,
        toneMapped: false,
        side: DoubleSide,
      })
      const mesh = new Mesh(
        new PlaneGeometry(worldSize, worldSize),
        mat,
      )
      mesh.frustumCulled = false

      const wrapper = new Group()
      wrapper.add(mesh)
      anchor.add(wrapper)

      return { config, group: wrapper, angle: config.phase, material: mat }
    })
    runtimeRef.current = created

    return () => {
      for (const { group } of created) {
        anchor.remove(group)
        group.traverse((obj) => {
          if (obj instanceof Mesh) {
            obj.geometry.dispose()
            const mat = obj.material as MeshBasicMaterial
            mat.map?.dispose()
            mat.dispose()
          }
        })
      }
      runtimeRef.current = []
    }
  }, [gl, items])

  useFrame((_, delta) => {
    for (const sat of runtimeRef.current) {
      const { config, group, material } = sat
      sat.angle += config.speed * delta
      const a = sat.angle
      const tilt = config.tiltX ?? 0.42
      const flatX = Math.cos(a) * config.radius
      const flatZ = Math.sin(a) * config.radius
      group.position.x = flatX
      group.position.y = flatZ * Math.sin(tilt)
      group.position.z = flatZ * Math.cos(tilt)

      // Fade & shrink when behind the head (negative z = away from camera)
      const z = group.position.z
      const normalZ = z / config.radius // -1 fully behind, +1 fully in front
      // Smooth fade: fully visible at normalZ >= 0.15, fully hidden at normalZ <= -0.15
      const opacity = Math.max(0, Math.min(1, (normalZ + 0.15) / 0.3))
      material.opacity = opacity
      group.visible = opacity > 0.01

      // Subtle depth-scale: slightly smaller when far, bigger when close
      const depthScale = 0.85 + 0.15 * ((normalZ + 1) / 2)
      group.scale.setScalar(depthScale)

      if (group.visible) {
        group.lookAt(camera.position)
      }
    }
  })

  return <group ref={setRef} position={modelPosition} />
})
