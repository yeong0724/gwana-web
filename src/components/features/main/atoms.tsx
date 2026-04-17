'use client';

import React from 'react';

import { motion } from 'framer-motion';

export const PulsingDot = React.memo(function PulsingDot() {
  return (
    <motion.span
      className="inline-block w-2 h-2 rounded-full bg-tea-500"
      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

export const ShimmerBar = React.memo(function ShimmerBar() {
  return (
    <div className="relative h-[1px] w-full overflow-hidden bg-brand-200/40">
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
        animate={{ x: ['-100%', '400%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
});
