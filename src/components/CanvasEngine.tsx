'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function PlainCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Simple, constant rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Basic geometric shape */}
      <icosahedronGeometry args={[1.5, 0]} />
      
      {/* meshBasicMaterial ignores all lighting and renders a pure, plain color */}
      <meshBasicMaterial color="#10b981" wireframe={true} opacity={0.5} transparent />
    </mesh>
  );
}

export default function CoreVisual() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Pure dark background matching your OS */}
        <color attach="background" args={['#050505']} />
        
        {/* Gentle floating animation */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <PlainCore />
        </Float>
      </Canvas>
    </div>
  );
}