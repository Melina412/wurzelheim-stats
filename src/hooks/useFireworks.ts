import { useEffect } from "react";
import confetti from "canvas-confetti";

/**
 * Fire a celebratory fireworks burst on mount (canvas-confetti). Bursts from
 * random positions on both sides, fading out over `durationMs`. Skipped when the
 * visitor prefers reduced motion.
 */
export function useFireworks(durationMs = 4500) {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const end = Date.now() + durationMs;
    const colors = ["#21a85b", "#ffcb05", "#2e7dd8", "#dc2649", "#7c5cff"];
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) return window.clearInterval(interval);
      const particleCount = 55 * (timeLeft / durationMs);
      confetti({
        ...defaults,
        colors,
        particleCount,
        origin: { x: randomInRange(0.1, 0.35), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        colors,
        particleCount,
        origin: { x: randomInRange(0.65, 0.9), y: Math.random() - 0.2 },
      });
    }, 260);

    return () => window.clearInterval(interval);
  }, [durationMs]);
}
