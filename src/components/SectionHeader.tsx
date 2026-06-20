import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="mb-8 max-w-2xl"
    >
      <h2 className="text-3xl font-bold tracking-tight text-base-fg sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </motion.div>
  );
}
