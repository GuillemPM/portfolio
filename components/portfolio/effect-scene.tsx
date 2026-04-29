"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import {
  Color,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Vector2,
} from "three"
import { AsciiEffect, DEFAULT_ASCII_PAGE_BACKGROUND } from "./ascii-effect"

const PRIMARY_EFFECT_COLOR = "#486cff"

export const DEFAULT_EFFECT_SCENE_GLB = "/models/wWubYahT.glb" as const

type UserModelProps = ComponentPropsWithoutRef<"group"> & { modelSrc: string }

function UserModel({ modelSrc, ...props }: UserModelProps) {
  const { scene } = useGLTF(modelSrc)

  const basicMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: PRIMARY_EFFECT_COLOR,
        roughness: 0.12, // Lower = sharper highlights, more contrast
        metalness: 0,
        flatShading: false,
      }),
    []
  )

  useEffect(() => {
    const disposeMaterial = (material: Material | Material[]) => {
      if (Array.isArray(material)) {
        material.forEach((item) => {
          if (item !== basicMat) item.dispose()
        })
        return
      }

      if (material !== basicMat) material.dispose()
    }

    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        const originalMat = obj.material
        // Dispose original material if it exists and is different
        if (originalMat) {
          try {
            disposeMaterial(originalMat)
          } catch {
            // Ignore disposal errors (context might be lost)
          }
        }
        obj.material = basicMat
      }
    })

    return () => {
      // Cleanup: dispose material when component unmounts
      // Wrap in try-catch to handle context loss gracefully
      try {
        if (basicMat && typeof basicMat.dispose === "function") {
          basicMat.dispose()
        }
      } catch {
        // Ignore disposal errors (context might be lost or already disposed)
      }
    }
  }, [scene, basicMat])

  return <primitive object={scene} {...props} />
}

const AUTO_ROTATE_SPEED = 0.4
const HOVER_SPIN_MULTIPLIER = 2
const TILT_FORWARD = 0.3
const TILT_LEFT = -0.08

/** Wobble when autoRotate is off (e.g. card embeds): slow sin waves, not continuous spin. */
const FLOAT_AMP_X = 0.1
const FLOAT_AMP_Y = 0.3
const FLOAT_AMP_Z = 0.1
const FLOAT_FREQ_X = 0.72
const FLOAT_FREQ_Y = 0.58
const FLOAT_FREQ_Z = 0.48
const FLOAT_PHASE_HOVER = 1.12
const FLOAT_DRAG_DAMP = 0.25

const CAMERA_BASE_Z = 4.5
const CAMERA_ZOOM_FACTOR = 1.1

/**
 * In-card embeds are tiny; default layout y is tuned for the hero, so embeds use this unless overridden.
 * Set `modelPosition` on `EffectScene` to nudge a specific model.
 */
export const DEFAULT_EMBED_MODEL_POSITION: [number, number, number] = [0, -0.12, 0]

function getSceneLayout(width: number): {
  cameraZ: number
  fov: number
  modelPosition: [number, number, number]
  modelScale: number
} {
  if (width < 520) {
    return {
      cameraZ: 5.75,
      fov: 54,
      modelPosition: [0, -0.55, 0],
      modelScale: 0.78,
    }
  }

  if (width < 900) {
    return {
      cameraZ: 5.1,
      fov: 52,
      modelPosition: [0.08, -0.28, 0],
      modelScale: 0.92,
    }
  }

  return {
    cameraZ: CAMERA_BASE_Z,
    fov: 48,
    modelPosition: [0.22, -0.06, 0],
    modelScale: 1.08,
  }
}

function DraggableUserModel({
  isHovered = false,
  modelSrc,
  modelScale: modelScaleOverride,
  modelPosition: modelPositionOverride,
  modelRotation: modelRotationOverride,
  autoRotate = true,
  float: floatEnabled = true,
}: {
  isHovered?: boolean
  modelSrc: string
  /** If set, overrides getSceneLayout().modelScale (e.g. card embeds). */
  modelScale?: number
  /** If set, overrides getSceneLayout().modelPosition. */
  modelPosition?: [number, number, number]
  /**
   * Base Euler (radians, XYZ order) applied after drag, before the scene tilt. Use to
   * face each GLB the way you want; drag + idle motion still add on top.
   */
  modelRotation?: [number, number, number]
  /**
   * When false, no continuous spin; a slight sinusoidal “float” wobble is used instead
   * (e.g. solution card embeds).
   */
  autoRotate?: boolean
  /**
   * When `autoRotate` is false, controls the idle wobble. Set false for a static rest
   * pose (still draggable).
   */
  float?: boolean
}) {
  const groupRef = useRef<Group>(null)
  const { size, gl } = useThree()
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const autoY = useRef(0)
  const floatT = useRef(0)

  const spinSpeed = isHovered ? AUTO_ROTATE_SPEED * HOVER_SPIN_MULTIPLIER : AUTO_ROTATE_SPEED
  const sceneLayout = getSceneLayout(size.width)
  const modelScale = modelScaleOverride ?? sceneLayout.modelScale
  const modelPosition = modelPositionOverride ?? sceneLayout.modelPosition
  const baseRx = modelRotationOverride?.[0] ?? 0
  const baseRy = modelRotationOverride?.[1] ?? 0
  const baseRz = modelRotationOverride?.[2] ?? 0

  useFrame((_, delta) => {
    if (!groupRef.current) return

    let addX = 0
    let addY = 0
    let addZ = 0

    if (autoRotate) {
      if (!isDragging.current) {
        autoY.current += delta * spinSpeed
      }
      addY = autoY.current
    } else if (floatEnabled) {
      floatT.current += delta
      const t = floatT.current
      const hover = isHovered ? FLOAT_PHASE_HOVER : 1
      const d = isDragging.current ? FLOAT_DRAG_DAMP : 1
      addX = Math.sin(t * FLOAT_FREQ_X + 0.35) * FLOAT_AMP_X * hover * d
      addY = Math.sin(t * FLOAT_FREQ_Y + 1.12) * FLOAT_AMP_Y * hover * d
      addZ = Math.sin(t * FLOAT_FREQ_Z + 2.05) * FLOAT_AMP_Z * hover * d
    }

    groupRef.current.rotation.x = rotation.x + baseRx + TILT_FORWARD + addX
    groupRef.current.rotation.y = rotation.y + baseRy + addY
    groupRef.current.rotation.z = baseRz + TILT_LEFT + addZ
  })

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (e: Event) => {
      const pe = e as PointerEvent
      if (pe.target === canvas) {
        isDragging.current = true
        lastPointer.current = { x: pe.clientX, y: pe.clientY }
      }
    }

    const onPointerMove = (e: Event) => {
      if (!isDragging.current) return
      const pe = e as PointerEvent
      const dx = (pe.clientX - lastPointer.current.x) * 0.005
      const dy = (pe.clientY - lastPointer.current.y) * 0.005
      lastPointer.current = { x: pe.clientX, y: pe.clientY }
      setRotation((r) => ({ x: r.x - dy, y: r.y + dx }))
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    canvas.addEventListener("pointerdown", onPointerDown as EventListener)
    window.addEventListener("pointermove", onPointerMove as EventListener)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown as EventListener)
      window.removeEventListener("pointermove", onPointerMove as EventListener)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [gl])

  return (
    <group ref={groupRef} position={modelPosition}>
      <UserModel key={modelSrc} modelSrc={modelSrc} scale={modelScale} />
    </group>
  )
}

function CameraHoverZoom({ isHovered = false }: { isHovered?: boolean }) {
  const { size } = useThree()
  const sceneLayout = getSceneLayout(size.width)

  useFrame(({ camera }) => {
    if (camera instanceof PerspectiveCamera && camera.fov !== sceneLayout.fov) {
      camera.fov = sceneLayout.fov
      camera.updateProjectionMatrix()
    }

    const targetZ = isHovered ? sceneLayout.cameraZ / CAMERA_ZOOM_FACTOR : sceneLayout.cameraZ
    camera.position.z += (targetZ - camera.position.z) * 0.08
    camera.position.x += (0 - camera.position.x) * 0.08
    camera.position.y += (0 - camera.position.y) * 0.08
  })
  return null
}

/** Mounts EffectComposer only after the first frame so WebGL context exists (avoids postprocessing addPass reading null .alpha) */
export const DEFAULT_ASCII_CELL_SIZE = 9

/** Shipped `AsciiEffect` `postfx` for full-width / hero; higher contrast, dramatic. */
export const DEFAULT_HERO_ASCII_POSTFX: Record<string, number> = {
  contrastAdjust: 1.8,
  brightnessAdjust: 0,
}

/**
 * Shipped for solution-card embeds. Override with `postfx` on `EffectScene` or per card.
 */
export const DEFAULT_SOLUTION_ASCII_POSTFX: Record<string, number> = {
  contrastAdjust: 0.7,
  brightnessAdjust: 0.02,
}

/**
 * In-card view: camera sits at +Z looking at the origin; these lights sit in front of the
 * subject (high +Z) so the model reads from the same side as the user. Hero uses raking
 * three-quarter lights for drama.
 */
function SolutionCardLights() {
  return (
    <>
      <ambientLight intensity={0.11} />
      <directionalLight position={[0, 0.2, 7.2]} intensity={6.8} />
      <directionalLight position={[0, 1.1, 4.2]} intensity={0.55} />
    </>
  )
}

function HeroAreaLights() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[2, 3.5, 6]} intensity={6} />
      <directionalLight position={[-2, 1.5, 4]} intensity={0.35} />
    </>
  )
}

function SceneWithDelayedComposer({
  resolution,
  mousePos,
  enableZoom = true,
  isHovered = false,
  modelSrc,
  modelScale,
  asciiCellSize = DEFAULT_ASCII_CELL_SIZE,
  transparentBackground = false,
  autoRotate = true,
  modelPosition,
  modelRotation,
  float: floatEnabled = true,
  embed = false,
  postfx = {},
}: {
  resolution: Vector2
  mousePos: Vector2
  enableZoom?: boolean
  isHovered?: boolean
  modelSrc: string
  modelScale?: number
  asciiCellSize?: number
  transparentBackground?: boolean
  autoRotate?: boolean
  modelPosition?: [number, number, number]
  modelRotation?: [number, number, number]
  float?: boolean
  embed?: boolean
  postfx?: Record<string, number | boolean>
}) {
  const { gl } = useThree()
  const [composerReady, setComposerReady] = useState(false)
  const frameCount = useRef(0)
  const scheduleComposerRef = useRef(false)

  useFrame(() => {
    if (composerReady) return
    frameCount.current++
    if (frameCount.current < 3 || scheduleComposerRef.current) return
    scheduleComposerRef.current = true
    setTimeout(() => {
      try {
        const context = gl.getContext()
        if (context && !(context as WebGLRenderingContext).isContextLost?.()) {
          setComposerReady(true)
        }
      } catch {
        // Ignore errors
      }
    }, 100)
  })

  return (
    <>
      {!transparentBackground && <color attach="background" args={[DEFAULT_ASCII_PAGE_BACKGROUND]} />}
      <Environment preset="studio" background={false} />
      {embed ? <SolutionCardLights /> : <HeroAreaLights />}
      <CameraHoverZoom isHovered={isHovered} />
      <Suspense key={modelSrc} fallback={null}>
        <DraggableUserModel
          isHovered={isHovered}
          modelSrc={modelSrc}
          modelScale={modelScale}
          modelPosition={modelPosition}
          modelRotation={modelRotation}
          autoRotate={autoRotate}
          float={floatEnabled}
        />
      </Suspense>
      <OrbitControls enableRotate={true} enableZoom={enableZoom} enablePan={true} />
      {composerReady && (
        <EffectComposer multisampling={transparentBackground ? 0 : undefined}>
          <AsciiEffect
            style="standard"
            cellSize={asciiCellSize}
            invert={true}
            color={true}
            characterSet="terminal"
            volumeShading={true}
            tintColor={PRIMARY_EFFECT_COLOR}
            resolution={resolution}
            mousePos={mousePos}
            postfx={postfx}
          />
        </EffectComposer>
      )}
    </>
  )
}

interface EffectSceneProps {
  className?: string
  /** Allow zoom with scroll wheel (default true). Set false on hero to block zoom. */
  enableZoom?: boolean
  /** Public URL path to a `.glb` in `/public` (e.g. `/models/hero.glb`). */
  modelSrc?: string
  /**
   * When set, the wrapper is sized by the parent only (no min-height: 300px).
   * Use for small in-card or inline embeds. Disables model auto-rotation by default.
   */
  embed?: boolean
  /** When false, the model only rotates via drag. Defaults to !embed. */
  autoRotate?: boolean
  /**
   * When `autoRotate` is off, `true` (default) applies the idle float wobble; set `false`
   * to keep the model static until the user drags.
   */
  float?: boolean
  /**
   * GLB world scale. When omitted, scale follows the responsive layout from canvas width. Set for embeds so the same model can read larger/smaller in a small view.
   */
  modelScale?: number
  /**
   * World-space position of the model root. When omitted, uses responsive `getSceneLayout`,
   * or for `embed` the default `DEFAULT_EMBED_MODEL_POSITION` unless you override.
   */
  modelPosition?: [number, number, number]
  /**
   * Base orientation in radians (Euler XYZ: pitch, yaw, roll). Added before the scene’s
   * built-in tilt; use per GLB to set the “rest” pose. Drag and idle motion stack on top.
   */
  modelRotation?: [number, number, number]
  /**
   * ASCII post-process cell size in pixels of the post buffer (smaller = denser). Default matches full-width hero; use e.g. 2 in small embeds.
   */
  asciiCellSize?: number
  /**
   * When true, the canvas clears to transparent and no solid scene background, so the parent can show through (e.g. card tile).
   */
  transparentBackground?: boolean
  /**
   * Merges with `DEFAULT_HERO_ASCII_POSTFX` or `DEFAULT_SOLUTION_ASCII_POSTFX` (when `embed`) for `AsciiEffect`.
   */
  postfx?: Record<string, number | boolean>
}

export function EffectScene({
  className,
  enableZoom = true,
  modelSrc = DEFAULT_EFFECT_SCENE_GLB,
  embed = false,
  modelScale,
  asciiCellSize = DEFAULT_ASCII_CELL_SIZE,
  transparentBackground = false,
  autoRotate: autoRotateProp,
  modelPosition: modelPositionProp,
  modelRotation,
  float: floatProp,
  postfx: postfxProp,
}: EffectSceneProps) {
  const autoRotate = autoRotateProp ?? !embed
  const modelPosition = modelPositionProp ?? (embed ? DEFAULT_EMBED_MODEL_POSITION : undefined)
  const float = floatProp !== false
  const asciiPostfx = {
    ...(embed ? DEFAULT_SOLUTION_ASCII_POSTFX : DEFAULT_HERO_ASCII_POSTFX),
    ...postfxProp,
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos] = useState(() => new Vector2(0, 0))
  const [resolution] = useState(() => new Vector2(1920, 1080))

  useEffect(() => {
    useGLTF.preload(modelSrc)
  }, [modelSrc])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateResolution = () => {
      const rect = container.getBoundingClientRect()
      resolution.set(rect.width || 1920, rect.height || 1080)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (container) {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = rect.height - (e.clientY - rect.top)
        mousePos.set(x, y)
      }
    }

    updateResolution()
    const ro = new ResizeObserver(updateResolution)
    ro.observe(container)
    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      ro.disconnect()
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mousePos, resolution])

  return (
    <div
      ref={containerRef}
      data-model-canvas-container
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        height: className ? "100%" : "100vh",
        minHeight: className && !embed ? 300 : undefined,
      }}
    >
      <Canvas
        dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)}
        gl={
          transparentBackground
            ? { alpha: true, antialias: true, premultipliedAlpha: false }
            : { antialias: true }
        }
        camera={{ position: [0, 0, CAMERA_BASE_Z], fov: 50 }}
        style={{
          background: transparentBackground ? "transparent" : DEFAULT_ASCII_PAGE_BACKGROUND,
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMappingExposure = 0.6
          if (transparentBackground) {
            gl.setClearColor(new Color(DEFAULT_ASCII_PAGE_BACKGROUND), 0)
            scene.background = null
          }

          const handleContextLost = (event: Event) => {
            event.preventDefault()
            console.warn("WebGL context lost. Attempting to restore...")
          }

          const handleContextRestored = () => {
            console.log("WebGL context restored")
          }

          gl.domElement.addEventListener("webglcontextlost", handleContextLost)
          gl.domElement.addEventListener("webglcontextrestored", handleContextRestored)

          return () => {
            gl.domElement.removeEventListener("webglcontextlost", handleContextLost)
            gl.domElement.removeEventListener("webglcontextrestored", handleContextRestored)
          }
        }}
      >
        <SceneWithDelayedComposer
          modelSrc={modelSrc}
          modelScale={modelScale}
          modelPosition={modelPosition}
          modelRotation={modelRotation}
          asciiCellSize={asciiCellSize}
          transparentBackground={transparentBackground}
          resolution={resolution}
          mousePos={mousePos}
          enableZoom={enableZoom}
          isHovered={isHovered}
          autoRotate={autoRotate}
          float={float}
          embed={embed}
          postfx={asciiPostfx}
        />
      </Canvas>
    </div>
  )
}

