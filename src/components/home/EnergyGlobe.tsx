import { useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 7000
const TEAL = new THREE.Color('#2CE0BE')
const GOLD = new THREE.Color('#F2B33D')

function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/** particle globe + station pulses + orbit satellites */
function Globe({ pointer }: { pointer: MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const R = 2
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = i * 2.399963
      const jitter = 0.02
      positions[i * 3] = (Math.cos(theta) * r + (Math.random() - 0.5) * jitter) * R
      positions[i * 3 + 1] = (y + (Math.random() - 0.5) * jitter) * R
      positions[i * 3 + 2] = (Math.sin(theta) * r + (Math.random() - 0.5) * jitter) * R
      const c = Math.random() < 0.7 ? TEAL : GOLD
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [])

  const markers = useMemo(() => {
    const arr: { pos: THREE.Vector3; quat: THREE.Quaternion; phase: number }[] = []
    for (let i = 0; i < 10; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(2.02)
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        v.clone().normalize(),
      )
      arr.push({ pos: v, quat: q, phase: Math.random() * Math.PI * 2 })
    }
    return arr
  }, [])

  const orbitPoints = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * 2.9, 0, Math.sin(a) * 2.9))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  const satRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.y += delta * ((Math.PI * 2) / 60)
    ringsRef.current?.children.forEach((child, i) => {
      const m = child as THREE.Mesh
      const phase = markers[i]?.phase ?? 0
      const p = ((t * 0.6 + phase) % 2) / 2
      m.scale.setScalar(1 + p * 5)
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = 0.55 * (1 - p)
    })
    satRefs.current.forEach((s, i) => {
      if (!s) return
      const speed = 0.25 + i * 0.06
      const a = t * speed + i * 2.1
      s.position.set(Math.cos(a) * 2.9, 0, Math.sin(a) * 2.9)
    })
    const cam = state.camera
    cam.position.x += (pointer.current.x * 0.35 - cam.position.x) * 0.04
    cam.position.y += (-pointer.current.y * 0.25 + 0.3 - cam.position.y) * 0.04
    cam.lookAt(0, 0, 0)
  })

  return (
    <>
      <group ref={group}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.022}
            vertexColors
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
        <group ref={ringsRef}>
          {markers.map((m, i) => (
            <mesh key={i} position={m.pos} quaternion={m.quat}>
              <ringGeometry args={[0.05, 0.075, 32]} />
              <meshBasicMaterial
                color="#F2B33D"
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      </group>
      <group rotation={[Math.PI / 3, 0, Math.PI / 8]}>
        <lineLoop geometry={orbitPoints}>
          <lineBasicMaterial color="#9AA8BF" transparent opacity={0.15} />
        </lineLoop>
        {[0, 1].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              satRefs.current[i] = el
            }}
          >
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={i === 0 ? '#F2B33D' : '#2CE0BE'} />
          </mesh>
        ))}
      </group>
      <group rotation={[Math.PI / 1.7, 0, -Math.PI / 6]}>
        <lineLoop geometry={orbitPoints}>
          <lineBasicMaterial color="#9AA8BF" transparent opacity={0.12} />
        </lineLoop>
        <mesh
          ref={(el) => {
            satRefs.current[2] = el
          }}
        >
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color="#F8CF6A" />
        </mesh>
      </group>
    </>
  )
}

/** Hero 3D background with static-poster fallback */
export default function EnergyGlobe() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [active, setActive] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSupported(!reduced && canUseWebGL())
  }, [])

  useEffect(() => {
    if (!wrapRef.current) return
    const io = new IntersectionObserver((e) => setActive(e[0].isIntersecting), {
      threshold: 0.05,
    })
    io.observe(wrapRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {supported === false && (
        <>
          <img src="/hero-poster.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-abyss/60 via-abyss/40 to-abyss" />
          <div className="absolute right-[10%] top-[30%] h-72 w-72 animate-pulse rounded-full bg-[radial-gradient(closest-side,rgba(242,179,61,0.18),transparent)]" />
        </>
      )}
      {supported && (
        <Canvas
          frameloop={active ? 'always' : 'never'}
          camera={{ position: [0, 0.3, 5.4], fov: 42 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <Globe pointer={pointer} />
        </Canvas>
      )}
    </div>
  )
}
