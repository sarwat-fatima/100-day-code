"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function FadeIn({
  className,
  children,
  ...props
}: MotionProps & { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

