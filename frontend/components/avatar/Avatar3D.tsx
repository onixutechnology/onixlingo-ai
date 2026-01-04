'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { useAvatarStore } from '@/store/avatarStore';
import * as THREE from 'three';
import { MathUtils } from 'three';

// --- LÓGICA DE ANIMACIÓN (Huesos y Gestos) ---
function HumanModel() {
  const { isSpeaking, isListening, gesture } = useAvatarStore();
  const { scene } = useGLTF('/models/avatar.glb');
  const { nodes } = useGraph(scene);

  // Mapeo de huesos
  const bones = useMemo(() => {
    const findBone = (names: string[]) => {
      for (const name of names) {
        const found = Object.values(nodes).find(n => n.name.toLowerCase().includes(name.toLowerCase()) && n.type === 'Bone');
        if (found) return found as THREE.Bone;
      }
      return null;
    };
    return {
      head: findBone(['Head', 'mixamorigHead', 'def_head']),
      neck: findBone(['Neck', 'mixamorigNeck', 'def_neck']),
      spine: findBone(['Spine', 'Spine1', 'mixamorigSpine', 'def_spine']),
      jaw: findBone(['Jaw', 'Teeth', 'Mouth']),
    };
  }, [nodes]);

  const currentLook = useRef(new THREE.Vector2(0, 0));
  const jawOpen = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. MIRADA (Head Tracking)
    let targetLookX = 0;
    let targetLookY = 0;

    if (gesture === 'idle' || gesture === 'listening' || isListening) {
      targetLookX = state.mouse.x * 0.3; // Movimiento más sutil
      targetLookY = state.mouse.y * 0.2;
    } else if (gesture === 'thinking') {
      targetLookX = -0.3; targetLookY = 0.3;
    }

    // Suavizado (Damping)
    currentLook.current.x = MathUtils.damp(currentLook.current.x, targetLookX, 2, delta);
    currentLook.current.y = MathUtils.damp(currentLook.current.y, targetLookY, 2, delta);

    if (bones.neck && bones.head) {
      // Distribuir rotación entre cuello y cabeza para naturalidad
      bones.neck.rotation.y = MathUtils.damp(bones.neck.rotation.y, currentLook.current.x * 0.5, 3, delta);
      bones.neck.rotation.x = MathUtils.damp(bones.neck.rotation.x, -currentLook.current.y * 0.3, 3, delta);
      bones.head.rotation.y = MathUtils.damp(bones.head.rotation.y, currentLook.current.x * 0.3, 3, delta);
      bones.head.rotation.x = MathUtils.damp(bones.head.rotation.x, -currentLook.current.y * 0.2, 3, delta);
    }

    // 2. RESPIRACIÓN
    if (bones.spine) {
      bones.spine.rotation.x = Math.sin(t * 0.7) * 0.02;
    }

    // 3. MOVIMIENTO DE BOCA (Lip Sync Simulado)
    let targetJaw = 0;
    if (isSpeaking) {
      targetJaw = ((Math.sin(t * 20) + 1) / 2) * 0.15;
    }
    jawOpen.current = MathUtils.damp(jawOpen.current, targetJaw, 15, delta);

    if (bones.jaw) {
      bones.jaw.rotation.x = jawOpen.current;
    } else if (isSpeaking && bones.head) {
      bones.head.rotation.x += Math.sin(t * 18) * 0.015;
    }
  });

  // --- POSICIÓN CORRECTIVA ---
  // Scale 1.5: Tamaño estándar.
  // Y = -2.2: Bajamos mucho el modelo. Como la cámara está lejos, esto centra la parte superior del cuerpo.
  return <primitive object={scene} scale={1.5} position={[0, -2.2, 0]} />;
}

// --- ESCENA OPTIMIZADA (SIN ERRORES DE SHADER) ---
export default function Avatar3D({ className }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className} min-h-[350px]`}>
      <Canvas
        // Quitamos 'shadows' global pesado para evitar el error de compilación de shader
        // Usaremos ContactShadows que es más barato y estable.
        
        // --- CÁMARA DE RETRATO LEJANA ---
        // Z=8.0: Muy alejada para que entre todo el torso y cabeza sin cortes.
        // Y=0.2: Altura de los ojos.
        // FOV=20: Lente muy cerrado (Teleobjetivo) para aplanar la imagen y que se vea profesional.
        camera={{ position: [0, 0.2, 8.0], fov: 20 }} 
        dpr={[1, 1.5]} // Limitamos la resolución de píxeles para rendimiento
      >
        {/* ILUMINACIÓN BÁSICA (Eficiente) */}
        <ambientLight intensity={0.7} />
        
        {/* Luz Principal (Sin sombras pesadas para evitar el error) */}
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff0e6" />
        
        {/* Luz de Relleno (Azulada) */}
        <directionalLight position={[-5, 5, 5]} intensity={0.8} color="#dbeafe" />
        
        {/* Luz Trasera (Rim Light - Efecto Cine) */}
        <spotLight position={[0, 5, -5]} intensity={2} color="#ffffff" angle={0.5} />

        {/* Entorno HDRI (Pre-baked lighting) */}
        <Environment preset="city" />

        <HumanModel />

        {/* Sombra falsa en el piso (Muy barata para la GPU) */}
        <ContactShadows resolution={256} scale={10} blur={2} opacity={0.3} far={10} color="#000000" />

        <OrbitControls 
          target={[0, 0.1, 0]} // Apunta a la cara
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/avatar.glb');