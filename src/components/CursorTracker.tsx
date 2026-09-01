'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type CursorMode = 'default' | 'interactive' | 'text';

export function CursorTracker() {
  const reduceMotion = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useSpring(cursorX, { stiffness: 1200, damping: 65, mass: 0.08 });
  const dotY = useSpring(cursorY, { stiffness: 1200, damping: 65, mass: 0.08 });
  const ringX = useSpring(cursorX, { stiffness: 360, damping: 28, mass: 0.32 });
  const ringY = useSpring(cursorY, { stiffness: 360, damping: 28, mass: 0.32 });
  const modeRef = useRef<CursorMode>('default');
  const [mode, setMode] = useState<CursorMode>('default');
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supportsPrecisionPointer = window.matchMedia('(pointer: fine)').matches;
    if (!supportsPrecisionPointer || reduceMotion) return;

    setEnabled(true);
    document.body.classList.add('cursor-enhanced');

    const updateMode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const nextMode: CursorMode = element?.closest('input, textarea, [contenteditable="true"]')
        ? 'text'
        : element?.closest('a, button, [role="button"], summary, label, select, [data-cursor="interactive"]')
          ? 'interactive'
          : 'default';

      if (nextMode !== modeRef.current) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const handleMove = (event: globalThis.PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      setVisible(true);
      updateMode(event.target);
    };
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.documentElement.addEventListener('mouseenter', handleEnter);

    return () => {
      document.body.classList.remove('cursor-enhanced');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.documentElement.removeEventListener('mouseenter', handleEnter);
    };
  }, [cursorX, cursorY, reduceMotion]);

  if (!enabled) return null;

  const interactive = mode === 'interactive';
  const text = mode === 'text';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-white/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, marginLeft: -20, marginTop: -20 }}
        animate={{
          width: text ? 18 : interactive ? 54 : 40,
          height: text ? 34 : interactive ? 54 : 40,
          opacity: visible ? (text ? 0.48 : 0.9) : 0,
          scale: pressed ? 0.78 : 1,
          borderRadius: text ? 5 : 999,
        }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 bg-white" animate={{ width: interactive ? 18 : 0, opacity: interactive ? 1 : 0 }} />
        <motion.span className="absolute left-1/2 top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-white" animate={{ height: interactive ? 18 : 0, opacity: interactive ? 1 : 0 }} />
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(190,242,100,.85)]"
        style={{ x: dotX, y: dotY, marginLeft: -3, marginTop: -3 }}
        animate={{ width: text ? 2 : interactive ? 8 : 6, height: text ? 22 : interactive ? 8 : 6, opacity: visible ? 1 : 0, scale: pressed ? 1.8 : 1, borderRadius: text ? 2 : 999 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
