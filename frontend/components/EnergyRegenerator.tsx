"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export default function EnergyRegenerator() {
  const regenerateEnergy = useUIStore((state) => state.regenerateEnergy);

  useEffect(() => {
    // Regenerate on mount
    regenerateEnergy();

    // Check every minute
    const interval = setInterval(() => {
      regenerateEnergy();
    }, 60000);

    return () => clearInterval(interval);
  }, [regenerateEnergy]);

  return null;
}
