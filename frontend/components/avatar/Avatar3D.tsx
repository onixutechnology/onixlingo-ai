'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import { useAvatarStore } from '@/store/avatarStore';
import * as THREE from 'three';

// --- FUNCIÓN DE MOVIMIENTO ORGÁNICO ---
const noise = (t: number, speed: number, amplitude: number, offset: number = 0) => {
  return (Math.sin(t * speed + offset) + Math.cos(t * speed * 0.7 + offset)) * amplitude;
};

function HumanModel() {
  const { isSpeaking, gesture } = useAvatarStore();
  const { scene } = useGLTF('/models/avatar.glb'); 
  const modelRef = useRef<THREE.Group>(null);
  const lerpSpeed = useRef(0.05);

  useFrame((state) => {
    if (!modelRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. IDLE: Respiración y balanceo sutil
    let targetY = -1.8 + noise(t, 1.5, 0.003); 
    let targetRotX = noise(t, 0.5, 0.01, 1);
    let targetRotY = noise(t, 0.3, 0.015, 2); 
    let targetRotZ = noise(t, 0.4, 0.005, 3);
    lerpSpeed.current = 0.06;

    // 2. HABLANDO: Movimiento más activo
    if (isSpeaking) {
       targetY += Math.sin(t * 18) * 0.005; 
       targetRotX += Math.sin(t * 10) * 0.02; 
       targetRotY += Math.sin(t * 5) * 0.03; 
       lerpSpeed.current = 0.1; 
    }

    // 3. GESTOS: Reacciones rápidas
    if (gesture) {
        lerpSpeed.current = 0.15;
        if (gesture === 'happy') {
            targetY += Math.abs(Math.sin(t * 6)) * 0.04 + 0.02; 
            targetRotX -= 0.08; 
        } else if (gesture === 'nod') {
            targetRotX += Math.sin(t * 12) * 0.15;
        } else if (gesture === 'thinking') {
            targetRotZ = 0.08;
            targetRotX = -0.05;
            targetRotY = 0.12;
        } else if (gesture === 'sad') {
            targetRotX = 0.20;
            targetY -= 0.04;
        }
    } else if (!isSpeaking) {
        // Reset suave
        targetRotX *= 0.8; targetRotY *= 0.8; targetRotZ *= 0.8;
    }

    // Aplicar movimiento suave
    modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, targetY, lerpSpeed.current);
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, lerpSpeed.current);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, lerpSpeed.current);
    modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, targetRotZ, lerpSpeed.current);
  });

  // ESCALA: 1.8 (Tamaño ideal)
  // POSICIÓN: -1.8 (Pies abajo)
  return <primitive ref={modelRef} object={scene} scale={1.8} position={[0, -1.8, 0]} />;
}

export default function Avatar3D() {
  return (
    <div className="w-full h-full relative bg-transparent">
      <Canvas
        shadows
        // --- AJUSTE DE CÁMARA PARA PLANO MEDIO ---
        // Y=0.7: Altura del pecho (centro de gravedad visual)
        // Z=4.2: Distancia perfecta para ver cabeza + torso + manos
        camera={{ position: [0, 0.7, 4.2], fov: 30 }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[2, 2, 5]} intensity={1.4} color="#fff5eb" castShadow />
        <spotLight position={[-3, 4, -2]} intensity={1.8} color="#e0f2fe" angle={0.5} /> 
        <pointLight position={[0, -1, 2]} intensity={0.6} color="#ffedd5" />

        <Environment preset="city" />

        <HumanModel />
        
        <ContactShadows opacity={0.35} scale={10} blur={3} far={4} color="#000000" />

        <OrbitControls 
            // --- TARGET AL PECHO ---
            // Apuntamos al centro del pecho (Y=0.7) para centrarlo verticalmente
            target={[0, 0.7, 0]} 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 2.1} 
            maxPolarAngle={Math.PI / 1.9}
            minAzimuthAngle={-Math.PI / 8}
            maxAzimuthAngle={Math.PI / 8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/avatar.glb');