import { forwardRef } from 'react';

// Thin progress bar pinned to the bottom of the sticky stage.
// App.jsx sets `style.width` directly in the rAF loop — no React state,
// no CSS transition, so it tracks scroll perfectly.
const ScrollProgress = forwardRef(function ScrollProgress(_props, ref) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 2,
        width: 0,
        zIndex: 50,
        background: 'linear-gradient(90deg, #4a7c59, #c8a96e)',
        boxShadow: '0 0 12px rgba(200,169,110,0.5)',
      }}
      ref={ref}
    />
  );
});

export default ScrollProgress;
