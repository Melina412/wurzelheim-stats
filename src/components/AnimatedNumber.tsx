import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { fmt } from "@/lib/format";

type Props = {
  value: number;
  duration?: number;
  className?: string;
};

export function AnimatedNumber({ value, duration = 2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {fmt(display)}
    </span>
  );
}
