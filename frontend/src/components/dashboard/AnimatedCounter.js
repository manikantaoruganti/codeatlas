import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export const AnimatedCounter = ({ value, duration = 1.2, decimals = 0, className, prefix = '', suffix = '' }) => {
  const ref = useRef(null);
  const numValue = Number(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || isNaN(numValue)) return;
    
    const controls = animate(0, numValue, {
      duration,
      ease: 'easeOut',
      onUpdate(latest) {
        node.textContent = latest.toFixed(decimals);
      },
    });
    
    return () => controls.stop();
  }, [numValue, duration, decimals]);

  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
};
