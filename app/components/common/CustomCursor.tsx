"use client";

import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const rafIdRef = useRef<number>(0);
    const lastCheckTimeRef = useRef<number>(0);

    useEffect(() => {
        const cursorDot = document.getElementById('cursorDot');
        const cursorOutline = document.getElementById('cursorOutline');

        if (!cursorDot || !cursorOutline) return;

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let targetSize = 40;
        let currentSize = 40;

        const onMouseMove = (e: MouseEvent): void => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            const now = performance.now();
            if (now - lastCheckTimeRef.current > 16) {
                const hoveredEl = document.elementFromPoint(mouseX, mouseY);
                targetSize = hoveredEl?.closest('.hoverable') ? 100 : 40;
                lastCheckTimeRef.current = now;
            }
        };

        const animateCursors = () => {
            if (cursorDot) {
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;
            }

            outlineX += (mouseX - outlineX) * 0.2;
            outlineY += (mouseY - outlineY) * 0.2;
            currentSize += (targetSize - currentSize) * 0.1;

            if (cursorOutline) {
                cursorOutline.style.left = `${outlineX}px`;
                cursorOutline.style.top = `${outlineY}px`;
                cursorOutline.style.width = `${currentSize}px`;
                cursorOutline.style.height = `${currentSize}px`;
            }

            rafIdRef.current = requestAnimationFrame(animateCursors);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        rafIdRef.current = requestAnimationFrame(animateCursors);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    return (
        <>
            <div
                id="cursorDot"
                className="w-[10px] h-[10px] bg-white fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-999999 pointer-events-none"
                style={{ mixBlendMode: 'difference' }}
            />
            <div
                id="cursorOutline"
                className="w-[40px] h-[40px] bg-white fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full z-999999 pointer-events-none"
                style={{ mixBlendMode: 'difference' }}
            />
        </>
    );
};

export default CustomCursor;
