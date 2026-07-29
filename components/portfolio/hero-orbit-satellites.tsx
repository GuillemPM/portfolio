"use client"

import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh as ThreeMesh,
  ShaderMaterial as ThreeShaderMaterial,
  Vector3,
  type Group,
  type Texture,
} from "three"

export type OrbitSatelliteConfig = {
  /** Public URL (e.g. `/images/bc-mark.svg`). Omit for built-in BC placeholder. */
  imageSrc?: string
  radius: number
  speed: number
  phase: number
  scale: number
  tiltX?: number
  trailColor?: string
}

export function createBcPlaceholderTexture(): CanvasTexture {
  const size = 128
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillStyle = "#00b7c3"
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, 22)
    ctx.fill()
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 42px system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("BC", size / 2, size / 2 + 2)
  }
  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function useBcPlaceholderTexture(): Texture {
  const texture = useMemo(() => createBcPlaceholderTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

const TRAIL_LENGTH = 260
const TRAIL_COLOR = "#486cff"
const TRAIL_OPACITY = 0.5

const TRAIL_WIDTH = 0.01

const trailVertexShader = /* glsl */ `
  attribute float alpha;
  varying float vAlpha;
  void main() {
    vAlpha = alpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const trailFragmentShader = /* glsl */ `
  uniform vec3 glowColor;
  varying float vAlpha;
  void main() {
    // Soft glow: brighter at head, fades to transparent
    float a = vAlpha * vAlpha;
    vec3 col = glowColor * (0.8 + a * 0.6);
    gl_FragColor = vec4(col, a * ${TRAIL_OPACITY.toFixed(2)});
  }
`

function OrbitTrail({ radius, speed, phase, tiltX = 0.42, color = TRAIL_COLOR }: {
  radius: number
  speed: number
  phase: number
  tiltX?: number
  color?: string
}): React.ReactElement {
  const meshRef = useRef<ThreeMesh>(null)
  const trailPositions = useRef<Vector3[]>([])
  const angleRef = useRef(phase)
  const tmpUp = useMemo(() => new Vector3(0, 1, 0), [])
  const tmpFwd = useMemo(() => new Vector3(), [])
  const tmpSide = useMemo(() => new Vector3(), [])

  const { geometry, material, meshObj } = useMemo(() => {
    // Ribbon: 2 vertices per trail point (left + right), forming a triangle strip
    const vertCount = TRAIL_LENGTH * 2
    const positions = new Float32Array(vertCount * 3)
    const alphas = new Float32Array(vertCount)
    const indices: number[] = []

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const fade = 1.0 - i / (TRAIL_LENGTH - 1)
      alphas[i * 2] = fade
      alphas[i * 2 + 1] = fade

      if (i < TRAIL_LENGTH - 1) {
        const a = i * 2
        const b = a + 1
        const c = a + 2
        const d = a + 3
        indices.push(a, c, b, b, c, d)
      }
    }

    const geo = new BufferGeometry()
    geo.setAttribute("position", new BufferAttribute(positions, 3))
    geo.setAttribute("alpha", new BufferAttribute(alphas, 1))
    geo.setIndex(indices)

    const c = new Color(color)
    const mat = new ThreeShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      uniforms: {
        glowColor: { value: new Vector3(c.r, c.g, c.b) },
      },
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    })

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trailPositions.current.push(new Vector3())
    }

    const mesh = new ThreeMesh(geo, mat)
    mesh.frustumCulled = false
    return { geometry: geo, material: mat, meshObj: mesh }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material, meshObj])

  useFrame(({ camera }, delta) => {
    angleRef.current += speed * delta
    const a = angleRef.current
    const flatX = Math.cos(a) * radius
    const flatZ = Math.sin(a) * radius
    const x = flatX
    const y = flatZ * Math.sin(tiltX)
    const z = flatZ * Math.cos(tiltX)

    // Shift trail
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      trailPositions.current[i].copy(trailPositions.current[i - 1])
    }
    trailPositions.current[0].set(x, y, z)

    // Build ribbon: offset each point sideways relative to camera
    const posAttr = geometry.getAttribute("position") as BufferAttribute
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const curr = trailPositions.current[i]
      const next = trailPositions.current[Math.min(i + 1, TRAIL_LENGTH - 1)]

      // Direction along the trail
      tmpFwd.subVectors(next, curr)
      if (tmpFwd.lengthSq() < 1e-8) {
        tmpFwd.set(0, 0, 1)
      }

      // Side vector: cross(forward, toCamera)
      tmpUp.subVectors(camera.position, curr).normalize()
      tmpSide.crossVectors(tmpFwd, tmpUp).normalize()

      // Width tapers along the trail
      const fade = 1.0 - i / (TRAIL_LENGTH - 1)
      const halfW = TRAIL_WIDTH * 0.5 * fade

      const idx = i * 6
      arr[idx]     = curr.x + tmpSide.x * halfW
      arr[idx + 1] = curr.y + tmpSide.y * halfW
      arr[idx + 2] = curr.z + tmpSide.z * halfW
      arr[idx + 3] = curr.x - tmpSide.x * halfW
      arr[idx + 4] = curr.y - tmpSide.y * halfW
      arr[idx + 5] = curr.z - tmpSide.z * halfW
    }
    posAttr.needsUpdate = true
  })

  return <primitive ref={meshRef} object={meshObj} />
}

type OrbitMotionProps = Pick<
  OrbitSatelliteConfig,
  "radius" | "speed" | "phase" | "scale" | "tiltX" | "trailColor"
> & { map: Texture }

function OrbitSatelliteMesh({
  radius,
  speed,
  phase,
  scale,
  tiltX = 0.42,
  trailColor,
  map,
}: OrbitMotionProps): React.ReactElement {
  const ref = useRef<Group>(null)
  const angle = useRef(phase)

  useFrame(({ camera }, delta) => {
    if (!ref.current) return
    angle.current += speed * delta
    const a = angle.current
    const flatX = Math.cos(a) * radius
    const flatZ = Math.sin(a) * radius
    ref.current.position.x = flatX
    ref.current.position.y = flatZ * Math.sin(tiltX)
    ref.current.position.z = flatZ * Math.cos(tiltX)
    // Billboard: always face camera
    ref.current.lookAt(camera.position)
  })

  return (
    <>
      <OrbitTrail radius={radius} speed={speed} phase={phase} tiltX={tiltX} color={trailColor} />
      <group ref={ref}>
        <mesh scale={scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            alphaTest={0.08}
            map={map}
            toneMapped={false}
            transparent
          />
        </mesh>
      </group>
    </>
  )
}

function OrbitSatellitePlaceholder(
  props: OrbitSatelliteConfig,
): React.ReactElement {
  const map = useBcPlaceholderTexture()
  return <OrbitSatelliteMesh {...props} map={map} />
}

function OrbitSatelliteTextured(
  props: OrbitSatelliteConfig & { imageSrc: string },
): React.ReactElement {
  const map = useTexture(props.imageSrc)
  return <OrbitSatelliteMesh {...props} map={map} />
}

function OrbitSatellite(props: OrbitSatelliteConfig): React.ReactElement {
  if (props.imageSrc) {
    return <OrbitSatelliteTextured {...props} imageSrc={props.imageSrc} />
  }
  return <OrbitSatellitePlaceholder {...props} />
}

export function HeroOrbitSatellites({
  items,
}: {
  items: OrbitSatelliteConfig[]
}): React.ReactElement {
  return (
    <group>
      {items.map((item, index) => (
        <OrbitSatellite key={`${item.imageSrc ?? "bc"}-${index}`} {...item} />
      ))}
    </group>
  )
}
