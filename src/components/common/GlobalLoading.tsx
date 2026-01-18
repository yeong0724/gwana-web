'use client';

import { Edges } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useIsMutating } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// WebGL 미지원 시 보여줄 Fallback 스피너
const FallbackSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="size-10 animate-spin text-gray-500" />
  </div>
);

interface SmallCubeProps {
  position: [number, number, number];
}

const SmallCube = ({ position }: SmallCubeProps) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
      <meshBasicMaterial color="white" />
      <Edges color="black" lineWidth={2} />
    </mesh>
  );
};

const CubeGrid = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.x = t * 1.0;
      groupRef.current.rotation.y = t * 1.4;
      groupRef.current.rotation.z = t * 0.6;
    }
  });

  // 2x2x2 정육면체 배치
  const cubePositions: [number, number, number][] = [
    // 앞면 (z = 0.26)
    [-0.26, 0.26, 0.26],
    [0.26, 0.26, 0.26],
    [-0.26, -0.26, 0.26],
    [0.26, -0.26, 0.26],
    // 뒷면 (z = -0.26)
    [-0.26, 0.26, -0.26],
    [0.26, 0.26, -0.26],
    [-0.26, -0.26, -0.26],
    [0.26, -0.26, -0.26],
  ];

  return (
    <group ref={groupRef}>
      {cubePositions.map((pos, i) => (
        <SmallCube key={i} position={pos} />
      ))}
    </group>
  );
};

const GlobalLoading = () => {
  const isMutating = useIsMutating();

  if (!isMutating) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15">
      <div className="w-40 h-40">
        <Suspense fallback={<FallbackSpinner />}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            fallback={<FallbackSpinner />}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} />
            <CubeGrid />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
};

export default GlobalLoading;
