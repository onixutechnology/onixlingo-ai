"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Generar partículas con variaciones para dar ese efecto de fragmentos/luces
export default function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generar menos partículas (10) y mucho más lentas para reducir uso de CPU
    const generated = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 4, // 4px a 14px
      x: Math.random() * 100, // % ancho
      y: Math.random() * 100, // % alto
      duration: Math.random() * 40 + 30, // 30s a 70s
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: "#000000", // Luces negras
            boxShadow: "0 0 15px 5px rgba(212, 175, 55, 0.4)", // Resplandor dorado al 40% (#D4AF37)
            left: `${p.x}%`,
            top: `${p.y}%`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -50, 0, 50, 0],
            x: [0, 30, 0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
