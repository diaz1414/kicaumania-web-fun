import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../store'

function FloatingObject() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const isChaosMode = useAppStore((state) => state.isChaosMode)

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isChaosMode) {
        // Frantic movement
        meshRef.current.rotation.x += delta * 5
        meshRef.current.rotation.y += delta * 5
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.5
      } else {
        // Smooth corporate movement
        meshRef.current.rotation.x += delta * 0.2
        meshRef.current.rotation.y += delta * 0.3
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
      }
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={isChaosMode ? 1.5 : 1}>
      <meshStandardMaterial 
        color={isChaosMode ? "#ef4444" : "#e2e8f0"} 
        roughness={0.1}
        metalness={0.8}
        envMapIntensity={1}
      />
    </Sphere>
  )
}

export function Background3D() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full opacity-50">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingObject />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
