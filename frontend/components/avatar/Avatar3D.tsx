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

  // Mapeo de huesos corporales completos
  const bones = useMemo(() => {
    const findBone = (names: string[]) => {
      // 1. Primer paso: Coincidencias exactas o terminaciones (evita falsos positivos como asociar LeftHandIndex1 a LeftHand)
      for (const name of names) {
        const target = name.toLowerCase();
        const found = Object.values(nodes).find(n => {
          const nodeName = n.name.toLowerCase();
          const isBone = n.type === 'Bone' || (n as any).isBone;
          return isBone && (nodeName === target || nodeName.endsWith(target) || nodeName.endsWith('_' + target));
        });
        if (found) return found as THREE.Bone;
      }
      // 2. Segundo paso: Coincidencia por subcadena como respaldo
      for (const name of names) {
        const target = name.toLowerCase();
        const found = Object.values(nodes).find(n => {
          const isBone = n.type === 'Bone' || (n as any).isBone;
          return isBone && n.name.toLowerCase().includes(target);
        });
        if (found) return found as THREE.Bone;
      }
      return null;
    };
    const resolved = {
      head: findBone(['Head', 'mixamorigHead', 'def_head']),
      neck: findBone(['Neck', 'mixamorigNeck', 'def_neck']),
      spine: findBone(['Spine', 'Spine1', 'mixamorigSpine', 'def_spine']),
      jaw: findBone(['Jaw', 'Teeth', 'Mouth']),
      leftArm: findBone(['LeftArm', 'mixamorigLeftArm', 'LeftUpArm', 'mixamorigLeftUpArm']),
      rightArm: findBone(['RightArm', 'mixamorigRightArm', 'RightUpArm', 'mixamorigRightUpArm']),
      leftForeArm: findBone(['LeftForeArm', 'mixamorigLeftForeArm']),
      rightForeArm: findBone(['RightForeArm', 'mixamorigRightForeArm']),
      leftHand: findBone(['LeftHand', 'mixamorigLeftHand']),
      rightHand: findBone(['RightHand', 'mixamorigRightHand']),
    };
    console.log("RESOLVED BONES:", Object.fromEntries(Object.entries(resolved).map(([k, v]) => [k, v ? { name: v.name, type: v.type } : null])));
    return resolved;
  }, [nodes]);

  const currentLook = useRef(new THREE.Vector2(0, 0));
  const jawOpen = useRef(0);
  
  // Referencias para amortiguación de extremidades (Inicializados en pose de reposo recta hacia abajo)
  const currentLeftArmX = useRef(1.25);
  const currentRightArmX = useRef(1.25);
  const currentLeftArmZ = useRef(-0.06);
  const currentRightArmZ = useRef(0.06);
  const currentLeftForeArmX = useRef(0.02);
  const currentRightForeArmX = useRef(0.02);
  const currentLeftForeArmY = useRef(0.13);
  const currentRightForeArmY = useRef(-0.13);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. MIRADA (Head Tracking deshabilitado para dejar al mono estático y mirando al frente)
    if (bones.neck && bones.head) {
      bones.neck.rotation.set(0, 0, 0);
      bones.head.rotation.set(0, 0, 0);
    }

    // 2. RESPIRACIÓN CORPORAL (Deshabilitada para dejar al mono estático)
    if (bones.spine) {
      bones.spine.rotation.set(0, 0, 0);
    }

    // 3. MOVIMIENTO DE BOCA (Lip Sync Simulado - El único movimiento dinámico al hablar)
    let targetJaw = 0;
    if (isSpeaking) {
      targetJaw = ((Math.sin(t * 22) + 1) / 2) * 0.16;
    }
    jawOpen.current = MathUtils.damp(jawOpen.current, targetJaw, 16, delta);

    if (bones.jaw) {
      bones.jaw.rotation.x = jawOpen.current;
    }

    // Pose por defecto estática: Brazos y manos colgando completamente rectos y relajados hacia abajo
    let targetLeftArmX = 1.25; // Ángulo natural de caída lateral de hombro
    let targetRightArmX = 1.25; 
    let targetLeftArmZ = -0.06; // Alineado snug al cuerpo
    let targetRightArmZ = 0.06; 
    let targetLeftForeArmY = 0.13; // Rotación neutral de codos
    let targetRightForeArmY = -0.13;
    let targetLeftForeArmX = 0.02; // Prácticamente recto hacia abajo
    let targetRightForeArmX = 0.02;

    // Suavizado (Damping) de poses
    currentLeftArmZ.current = MathUtils.damp(currentLeftArmZ.current, targetLeftArmZ, 4, delta);
    currentRightArmZ.current = MathUtils.damp(currentRightArmZ.current, targetRightArmZ, 4, delta);
    currentLeftArmX.current = MathUtils.damp(currentLeftArmX.current, targetLeftArmX, 4, delta);
    currentRightArmX.current = MathUtils.damp(currentRightArmX.current, targetRightArmX, 4, delta);
    currentLeftForeArmY.current = MathUtils.damp(currentLeftForeArmY.current, targetLeftForeArmY, 4, delta);
    currentRightForeArmY.current = MathUtils.damp(currentRightForeArmY.current, targetRightForeArmY, 4, delta);
    currentLeftForeArmX.current = MathUtils.damp(currentLeftForeArmX.current, targetLeftForeArmX, 4, delta);
    currentRightForeArmX.current = MathUtils.damp(currentRightForeArmX.current, targetRightForeArmX, 4, delta);

    if (bones.leftArm && bones.rightArm) {
      bones.leftArm.rotation.z = currentLeftArmZ.current;
      bones.rightArm.rotation.z = currentRightArmZ.current;
      bones.leftArm.rotation.x = currentLeftArmX.current;
      bones.rightArm.rotation.x = currentRightArmX.current;
    }

    if (bones.leftForeArm && bones.rightForeArm) {
      bones.leftForeArm.rotation.y = currentLeftForeArmY.current;
      bones.rightForeArm.rotation.y = currentRightForeArmY.current;
      bones.leftForeArm.rotation.x = currentLeftForeArmX.current;
      bones.rightForeArm.rotation.x = currentRightForeArmX.current;
    }

    // Rotación de muñecas y manos estática colgando perfectamente hacia abajo
    if (bones.leftHand && bones.rightHand) {
      bones.leftHand.rotation.set(0, 0, 0);
      bones.rightHand.rotation.set(0, 0, 0);
    }
  });

  // --- POSICIÓN CORRECTIVA ---
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