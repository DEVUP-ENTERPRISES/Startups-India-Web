'use client';

import { useEffect, useState, useRef } from 'react';
import '../../styles/custom-cursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const iconRef = useRef(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const [ripples, setRipples] = useState([]);
  const rippleIdCounter = useRef(0);
  const isMovingRef = useRef(false);

  // High performance positioning state
  const posParams = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    angle: 0,
  });

  const animFrameId = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // In development with devtools open, touch might be simulated. 
    // We enable the cursor if it's not a touch device OR if screen is large enough (desktop).
    if (!isTouchDevice || window.innerWidth > 1024) {
      setIsMobile(false);
      document.body.classList.add('custom-cursor-active');
    } else {
      setIsMobile(true);
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    const pos = posParams.current;

    const render = () => {
      // Frame-by-frame interpolation for smooth motion & magnetic effect
      const dx = pos.targetX - pos.x;
      const dy = pos.targetY - pos.y;

      pos.x += dx * 0.4;
      pos.y += dy * 0.4;

      // Track horizontal movement for subtle banking/rotation (Max 15deg)
      const targetAngle = Math.min(Math.max(dx * 1.5, -15), 15);
      pos.angle += (targetAngle - pos.angle) * 0.15;

      if (cursorRef.current && iconRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        iconRef.current.style.transform = `rotate(${pos.angle}deg)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };
    animFrameId.current = requestAnimationFrame(render);

    const onMouseMove = e => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      const target = e.target;
      let hoveringBtn = false;

      if (target) {
        const tagName = target.tagName?.toLowerCase();
        const type = target.getAttribute('type')?.toLowerCase();

        // Check for text inputs to revert to native I-beam
        const isTextInput =
          tagName === 'textarea' ||
          target.isContentEditable ||
          (tagName === 'input' &&
            !['button', 'submit', 'image', 'radio', 'checkbox'].includes(type));

        setIsTextHover(isTextInput);

        // Check for interactive elements to trigger hover and magnet logic
        const btnElement = target.closest('a, button, [role="button"], .hero-pill');
        if (btnElement && !isTextInput) {
          hoveringBtn = true;
          const rect = btnElement.getBoundingClientRect();
          const btnCenterX = rect.left + rect.width / 2;
          const btnCenterY = rect.top + rect.height / 2;

          // Micro-magnetic pull (max ~3px)
          const pullX = (btnCenterX - e.clientX) * 0.1;
          const pullY = (btnCenterY - e.clientY) * 0.1;

          targetX += Math.max(-3, Math.min(3, pullX));
          targetY += Math.max(-3, Math.min(3, pullY));
        }
      }

      setIsHovering(hoveringBtn);

      pos.targetX = targetX;
      pos.targetY = targetY;

      if (!isMovingRef.current) {
        pos.x = targetX;
        pos.y = targetY;
        isMovingRef.current = true;
        setIsMoving(true);
      }
    };

    const onMouseDown = e => {
      setIsClicking(true);
      const newRipple = {
        id: rippleIdCounter.current++,
        x: e.clientX,
        y: e.clientY,
      };
      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 500);
    };

    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };
    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {ripples.map(rip => (
        <div key={rip.id} className="cursor-ripple" style={{ left: rip.x, top: rip.y }} />
      ))}
      <div
        className={`custom-cursor-wrapper ${isMoving ? 'is-moving' : ''} ${
          isHovering ? 'is-hovering' : ''
        } ${isTextHover ? 'is-text-hover' : ''} ${isClicking ? 'is-clicking' : ''}`}
        ref={cursorRef}
      >
        <div className="custom-cursor-icon" ref={iconRef}>
          <div className="cursor-halo" />
          <svg
            className="custom-cursor-plane"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.25))' }}
          >
            <path
              d="M0 0 L27 9 L15 15 L9 27 Z"
              fill="#E53935"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M0 0 L15 15" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 13 L15 15 L10 20 Z" fill="#EF5350" />
          </svg>
        </div>
      </div>
    </>
  );
}
