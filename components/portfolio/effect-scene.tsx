"use client"

import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  FrontSide,
  Group,
  LinearFilter,
  Material,
  Mesh,
  PerspectiveCamera,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three"
import { DEFAULT_ASCII_PAGE_BACKGROUND } from "./ascii-effect"
import type { OrbitSatelliteConfig } from "./hero-orbit-satellites"
import { HeroOrbitSatellites } from "./hero-orbit-satellites"

const PRIMARY_EFFECT_COLOR = "#486cff"

export const DEFAULT_EFFECT_SCENE_GLB = "/models/wWubYahT.glb" as const

// --- ASCII mesh material ---

const ASCII_CHARS = " .:-=+*#%@"

function createAsciiGlyphAtlas(chars: string, cellSize = 64): CanvasTexture {
  const count = chars.length
  const canvas = document.createElement("canvas")
  canvas.width = cellSize * count
  canvas.height = cellSize
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#fff"
  ctx.font = `bold ${Math.floor(cellSize * 0.85)}px monospace`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  for (let i = 0; i < count; i++) {
    ctx.fillText(chars[i], i * cellSize + cellSize / 2, cellSize / 2)
  }
  const tex = new CanvasTexture(canvas)
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.wrapS = ClampToEdgeWrapping
  tex.wrapT = ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

const asciiMeshVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vScreenUV;
varying vec3 vVertexColor;

#ifdef USE_COLOR
  // Three.js injects 'attribute vec3 color' when vertexColors is true
#endif

void main() {
  vNormal = normalize(normalMatrix * normal);
  #ifdef USE_COLOR
    vVertexColor = color.rgb;
  #else
    vVertexColor = vec3(0.0);
  #endif
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vec4 clipPos = projectionMatrix * viewMatrix * worldPos;
  gl_Position = clipPos;
  vScreenUV = clipPos.xy / clipPos.w * 0.5 + 0.5;
}
`

const asciiMeshFragmentShader = /* glsl */ `
uniform vec3 baseColor;
uniform vec3 lightDir;
uniform float cellSize;
uniform vec2 resolution;
uniform sampler2D glyphAtlas;
uniform float glyphCount;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vScreenUV;
varying vec3 vVertexColor;

void main() {
  // Detect eyeballs by vertex color brightness (eyeballs are white/very bright)
  float vertBrightness = dot(vVertexColor, vec3(0.299, 0.587, 0.114));
  if (vertBrightness > 0.85) discard;

  // Simple diffuse lighting
  float diffuse = max(dot(normalize(vNormal), normalize(lightDir)), 0.0);
  float ambient = 0.12;
  float lighting = ambient + diffuse * 0.88;

  // ASCII grid in screen space
  vec2 cellCount = resolution / cellSize;
  vec2 cell = floor(vScreenUV * cellCount);
  vec2 cellFrac = fract(vScreenUV * cellCount);

  // Pick glyph based on brightness
  float idx = floor(lighting * (glyphCount - 1.0) + 0.5);
  idx = clamp(idx, 0.0, glyphCount - 1.0);

  // Sample glyph atlas
  vec2 glyphUV = vec2((idx + cellFrac.x) / glyphCount, 1.0 - cellFrac.y);
  float glyphAlpha = texture2D(glyphAtlas, glyphUV).r;

  // Color the glyph with tinted base color
  vec3 color = baseColor * (0.6 + lighting * 0.4);
  
  // Discard background pixels for transparent look
  if (glyphAlpha < 0.1) discard;

  gl_FragColor = vec4(color * glyphAlpha, 1.0);
}
`

// Depth-only pre-pass material: writes solid depth so back faces are fully occluded
function createDepthPrePassMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      void main() {
        gl_FragColor = vec4(0.0);
      }
    `,
    colorWrite: false,
    side: FrontSide,
  })
}

function createAsciiMeshMaterial(resolution: Vector2): ShaderMaterial {
  const atlas = createAsciiGlyphAtlas(ASCII_CHARS)
  const color = new Color(PRIMARY_EFFECT_COLOR)
  return new ShaderMaterial({
    vertexShader: asciiMeshVertexShader,
    fragmentShader: asciiMeshFragmentShader,
    uniforms: {
      baseColor: { value: new Vector3(color.r, color.g, color.b) },
      lightDir: { value: new Vector3(2, 3.5, 6).normalize() },
      cellSize: { value: 8.0 },
      resolution: { value: resolution },
      glyphAtlas: { value: atlas },
      glyphCount: { value: ASCII_CHARS.length },
    },
    vertexColors: true,
    side: FrontSide,
    depthWrite: false,  // depth already written by pre-pass
  })
}

// --- End ASCII mesh material ---

type UserModelProps = ComponentPropsWithoutRef<"group"> & {
  modelSrc: string
  resolution: Vector2
}

function UserModel({ modelSrc, resolution, ...props }: UserModelProps) {
  const { scene } = useGLTF(modelSrc)

  const { depthMat, asciiMat } = useMemo(() => ({
    depthMat: createDepthPrePassMaterial(),
    asciiMat: createAsciiMeshMaterial(resolution),
  }), [resolution])

  useEffect(() => {
    const depthClones: Mesh[] = []

    const disposeMaterial = (material: Material | Material[]) => {
      if (Array.isArray(material)) {
        material.forEach((item) => {
          if (item !== asciiMat && item !== depthMat) item.dispose()
        })
        return
      }

      if (material !== asciiMat && material !== depthMat) material.dispose()
    }

    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        const originalMat = obj.material
        if (originalMat) {
          try {
            disposeMaterial(originalMat)
          } catch {
            // Ignore disposal errors
          }
        }
        // ASCII material on the original mesh
        obj.material = asciiMat
        obj.renderOrder = 1

        // Depth pre-pass clone: renders first, writes solid depth
        const depthClone = new Mesh(obj.geometry, depthMat)
        depthClone.renderOrder = 0
        depthClone.frustumCulled = obj.frustumCulled
        depthClone.position.copy(obj.position)
        depthClone.rotation.copy(obj.rotation)
        depthClone.scale.copy(obj.scale)
        depthClone.matrix.copy(obj.matrix)
        depthClone.matrixAutoUpdate = obj.matrixAutoUpdate
        obj.parent?.add(depthClone)
        depthClones.push(depthClone)
      }
    })

    return () => {
      for (const clone of depthClones) {
        clone.parent?.remove(clone)
      }
      try {
        asciiMat.dispose()
        depthMat.dispose()
      } catch {
        // Ignore disposal errors
      }
    }
  }, [scene, asciiMat, depthMat])

  return <primitive object={scene} {...props} />
}

/** Peak yaw (rad) each side of center — slow look left / look right */
const AUTO_SWAY_AMPLITUDE = 0.38
/** Seconds for one full left → right → left cycle */
const AUTO_SWAY_CYCLE_SEC = 18
const TILT_FORWARD = -0.18
const TILT_LEFT = -0.08

/** Manual drag pitch (rotation.x), radians — relative to default pose */
const DRAG_PITCH_MIN = -0.45
const DRAG_PITCH_MAX = 0.32
const DRAG_POINTER_SENS = 0.005
/** How quickly rotation catches the pointer while dragging (higher = snappier) */
const DRAG_FOLLOW = 14
/** Inertia decay after release (higher = stops sooner) */
const DRAG_INERTIA_DAMP = 4.5
const DRAG_INERTIA_CUTOFF = 0.02

function clampDragPitch(x: number): number {
  return Math.max(DRAG_PITCH_MIN, Math.min(DRAG_PITCH_MAX, x))
}

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
  enableDrag = true,
  children,
  resolution,
}: {
  isHovered?: boolean
  modelSrc: string
  modelScale?: number
  modelPosition?: [number, number, number]
  modelRotation?: [number, number, number]
  autoRotate?: boolean
  float?: boolean
  enableDrag?: boolean
  children?: React.ReactNode
  resolution: Vector2
}) {
  const groupRef = useRef<Group>(null)
  const { size, gl } = useThree()
  const rotationRef = useRef({ x: 0, y: 0 })
  const dragTargetRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const swayT = useRef(0)
  const floatT = useRef(0)

  const swayOmega = (Math.PI * 2) / AUTO_SWAY_CYCLE_SEC

  const getSwayY = () =>
    Math.sin(swayT.current * swayOmega) * AUTO_SWAY_AMPLITUDE

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

    const coasting =
      Math.abs(velocityRef.current.x) > DRAG_INERTIA_CUTOFF ||
      Math.abs(velocityRef.current.y) > DRAG_INERTIA_CUTOFF

    if (isDragging.current) {
      const follow = 1 - Math.exp(-DRAG_FOLLOW * delta)
      const rx = rotationRef.current.x
      const ry = rotationRef.current.y
      const tx = dragTargetRef.current.x
      const ty = dragTargetRef.current.y
      const nx = rx + (tx - rx) * follow
      const ny = ry + (ty - ry) * follow
      velocityRef.current.x = (nx - rx) / Math.max(delta, 1e-4)
      velocityRef.current.y = (ny - ry) / Math.max(delta, 1e-4)
      rotationRef.current.x = clampDragPitch(nx)
      rotationRef.current.y = ny
    } else if (coasting) {
      rotationRef.current.y += velocityRef.current.y * delta
      rotationRef.current.x = clampDragPitch(
        rotationRef.current.x + velocityRef.current.x * delta,
      )
      const damp = Math.exp(-DRAG_INERTIA_DAMP * delta)
      velocityRef.current.x *= damp
      velocityRef.current.y *= damp
    } else if (autoRotate) {
      swayT.current += delta
      addY = getSwayY()
    } else if (floatEnabled) {
      floatT.current += delta
      const t = floatT.current
      const hover = isHovered ? FLOAT_PHASE_HOVER : 1
      const d = isDragging.current ? FLOAT_DRAG_DAMP : 1
      addX = Math.sin(t * FLOAT_FREQ_X + 0.35) * FLOAT_AMP_X * hover * d
      addY = Math.sin(t * FLOAT_FREQ_Y + 1.12) * FLOAT_AMP_Y * hover * d
      addZ = Math.sin(t * FLOAT_FREQ_Z + 2.05) * FLOAT_AMP_Z * hover * d
    }

    const pitch = clampDragPitch(rotationRef.current.x)
    rotationRef.current.x = pitch
    groupRef.current.rotation.x = pitch + baseRx + TILT_FORWARD + addX
    groupRef.current.rotation.y = rotationRef.current.y + baseRy + addY
    groupRef.current.rotation.z = baseRz + TILT_LEFT + addZ
  })

  useEffect(() => {
    if (!enableDrag) return

    const canvas = gl.domElement

    const onPointerDown = (e: Event) => {
      const pe = e as PointerEvent
      if (pe.target === canvas) {
        if (autoRotate) {
          const swayY = getSwayY()
          rotationRef.current.y += swayY
          swayT.current = 0
        }
        dragTargetRef.current.x = rotationRef.current.x
        dragTargetRef.current.y = rotationRef.current.y
        velocityRef.current.x = 0
        velocityRef.current.y = 0
        isDragging.current = true
        lastPointer.current = { x: pe.clientX, y: pe.clientY }
      }
    }

    const onPointerMove = (e: Event) => {
      if (!isDragging.current) return
      const pe = e as PointerEvent
      const dx = (pe.clientX - lastPointer.current.x) * DRAG_POINTER_SENS
      const dy = (pe.clientY - lastPointer.current.y) * DRAG_POINTER_SENS
      lastPointer.current = { x: pe.clientX, y: pe.clientY }
      dragTargetRef.current.y += dx
      dragTargetRef.current.x = clampDragPitch(
        dragTargetRef.current.x + dy,
      )
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
  }, [enableDrag, gl])

  return (
    <group position={modelPosition}>
      <group ref={groupRef}>
        <UserModel key={modelSrc} modelSrc={modelSrc} resolution={resolution} scale={modelScale} />
        {children}
      </group>
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

    const targetZ = sceneLayout.cameraZ
    camera.position.z += (targetZ - camera.position.z) * 0.08
    camera.position.x += (0 - camera.position.x) * 0.08
    camera.position.y += (0 - camera.position.y) * 0.08
  })
  return null
}

export const DEFAULT_ASCII_CELL_SIZE = 9

export const DEFAULT_HERO_ASCII_POSTFX: Record<string, number> = {
  contrastAdjust: 1.8,
  brightnessAdjust: 0,
}

export const DEFAULT_SOLUTION_ASCII_POSTFX: Record<string, number> = {
  contrastAdjust: 0.7,
  brightnessAdjust: 0.02,
}

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
  pageBackgroundColor,
  autoRotate = true,
  modelPosition,
  modelRotation,
  float: floatEnabled = true,
  embed = false,
  postfx = {},
  orbitSatellites,
  enableDrag = true,
}: {
  resolution: Vector2
  mousePos: Vector2
  enableZoom?: boolean
  isHovered?: boolean
  modelSrc: string
  modelScale?: number
  asciiCellSize?: number
  transparentBackground?: boolean
  pageBackgroundColor?: string
  autoRotate?: boolean
  modelPosition?: [number, number, number]
  modelRotation?: [number, number, number]
  float?: boolean
  embed?: boolean
  postfx?: Record<string, number | boolean>
  orbitSatellites?: OrbitSatelliteConfig[]
  enableDrag?: boolean
}) {
  const { gl, size } = useThree()
  const [composerReady, setComposerReady] = useState(false)
  const frameCount = useRef(0)
  const scheduleComposerRef = useRef(false)
  const resolvedModelPosition =
    modelPosition ?? getSceneLayout(size.width).modelPosition

  const hasSatellites = !!(orbitSatellites && orbitSatellites.length > 0 && !embed)
  const sceneBackground =
    pageBackgroundColor ??
    (transparentBackground ? undefined : DEFAULT_ASCII_PAGE_BACKGROUND)

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
      {sceneBackground ? <color attach="background" args={[sceneBackground]} /> : null}
      <Environment files="/hdri/studio_small_03_1k.hdr" background={false} />
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
          enableDrag={enableDrag}
          resolution={resolution}
        >
          {hasSatellites && (
            <group position={[0, 0, 0]}>
              <HeroOrbitSatellites items={orbitSatellites!} />
            </group>
          )}
        </DraggableUserModel>
      </Suspense>
      {enableDrag || enableZoom ? (
        <OrbitControls
          enableRotate={enableDrag && !autoRotate}
          enableZoom={enableZoom}
          enablePan={enableDrag && !autoRotate}
        />
      ) : null}
      {/* EffectComposer disabled for debugging */}
      {/* {composerReady && (
        <EffectComposer
          multisampling={transparentBackground ? 0 : undefined}
        >
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
            pageBackgroundColor={pageBackgroundColor}
          />
        </EffectComposer>
      )} */}
    </>
  )
}

interface EffectSceneProps {
  className?: string
  enableZoom?: boolean
  modelSrc?: string
  embed?: boolean
  autoRotate?: boolean
  float?: boolean
  modelScale?: number
  modelPosition?: [number, number, number]
  modelRotation?: [number, number, number]
  asciiCellSize?: number
  transparentBackground?: boolean
  pageBackgroundColor?: string
  postfx?: Record<string, number | boolean>
  orbitSatellites?: OrbitSatelliteConfig[]
  enableDrag?: boolean
}

function useEnableSceneDrag(): boolean {
  const subscribe = (onStoreChange: () => void): (() => void) => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    media.addEventListener("change", onStoreChange)
    return () => media.removeEventListener("change", onStoreChange)
  }
  const getSnapshot = (): boolean =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  const getServerSnapshot = (): boolean => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function CanvasInteractionGate({ enableDrag }: { enableDrag: boolean }): null {
  const { gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    if (enableDrag) {
      canvas.style.pointerEvents = ""
      canvas.style.touchAction = ""
    } else {
      canvas.style.pointerEvents = "none"
      canvas.style.touchAction = "pan-y"
    }
  }, [enableDrag, gl])

  return null
}

export function EffectScene({
  className,
  enableZoom = true,
  modelSrc = DEFAULT_EFFECT_SCENE_GLB,
  embed = false,
  modelScale,
  asciiCellSize = DEFAULT_ASCII_CELL_SIZE,
  transparentBackground = false,
  pageBackgroundColor,
  autoRotate: autoRotateProp,
  modelPosition: modelPositionProp,
  modelRotation,
  float: floatProp,
  postfx: postfxProp,
  orbitSatellites: orbitSatellitesProp,
  enableDrag: enableDragProp,
}: EffectSceneProps) {
  const finePointerDesktop = useEnableSceneDrag()
  const autoRotate = autoRotateProp ?? !embed
  const enableDrag = enableDragProp ?? (finePointerDesktop && !embed)
  const modelPosition = modelPositionProp ?? (embed ? DEFAULT_EMBED_MODEL_POSITION : undefined)
  const float = floatProp !== false
  const orbitSatellites = embed ? undefined : orbitSatellitesProp
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
        touchAction: enableDrag ? undefined : "pan-y",
        pointerEvents: enableDrag ? undefined : "none",
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
          background:
            pageBackgroundColor ??
            (transparentBackground ? "transparent" : DEFAULT_ASCII_PAGE_BACKGROUND),
          pointerEvents: enableDrag ? "auto" : "none",
          touchAction: enableDrag ? "auto" : "pan-y",
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMappingExposure = 0.6
          if (pageBackgroundColor) {
            gl.setClearColor(new Color(pageBackgroundColor), 1)
          } else if (transparentBackground) {
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
        <CanvasInteractionGate enableDrag={enableDrag} />
        <SceneWithDelayedComposer
          modelSrc={modelSrc}
          modelScale={modelScale}
          modelPosition={modelPosition}
          modelRotation={modelRotation}
          asciiCellSize={asciiCellSize}
          transparentBackground={transparentBackground}
          pageBackgroundColor={pageBackgroundColor}
          resolution={resolution}
          mousePos={mousePos}
          enableZoom={enableZoom}
          isHovered={isHovered}
          autoRotate={autoRotate}
          float={float}
          embed={embed}
          postfx={asciiPostfx}
          orbitSatellites={orbitSatellites}
          enableDrag={enableDrag}
        />
      </Canvas>
    </div>
  )
}
