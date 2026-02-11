/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useState, useLayoutEffect, useCallback, useEffect } from 'react';

export interface DragWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMaximize?: () => void;
  onFocus?: () => void;
  onDragStart?: () => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  zIndex?: number;
  initialX: number;
  initialY: number;
  width?: number;
  height?: number;
  maxY?: number;
  isMinimized?: boolean;
  minWidth?: number;
  minHeight?: number;
  isOpening?: boolean;
}

const DragWindow = ({
  title,
  children,
  onClose,
  onMaximize,
  onFocus,
  onDragStart,
  onDragMove,
  onDragEnd,
  zIndex = 1,
  initialX,
  initialY,
  width = 500,
  height = 300,
  maxY,
  isMinimized = false,
  minWidth = 300,
  minHeight = 200,
}: DragWindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: initialX, y: initialY });
  const [dimensions, setDimensions] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const constrainPosition = useCallback(
    (x: number, y: number) => {
      const maxX = window.innerWidth - dimensions.width;
      const effectiveMaxY = maxY ? maxY - dimensions.height : window.innerHeight - dimensions.height;
      return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, effectiveMaxY)),
      };
    },
    [dimensions.width, dimensions.height, maxY]
  );

  useLayoutEffect(() => {
    if (isDragging || isResizing) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }

    if (windowRef.current) {
      if (isClosing) {
        windowRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(0.8)`;
        windowRef.current.style.opacity = '0';
      } else if (isAnimating) {
        windowRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(0.8)`;
        windowRef.current.style.opacity = '0';
        requestAnimationFrame(() => {
          if (windowRef.current) {
            windowRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(1)`;
            windowRef.current.style.opacity = '1';
          }
        });
      } else {
        windowRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(1)`;
        windowRef.current.style.opacity = '1';
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        e.preventDefault();
        const newX = e.clientX - dragOffsetRef.current.x;
        const newY = e.clientY - dragOffsetRef.current.y;
        const constrained = constrainPosition(newX, newY);
        windowRef.current.style.transform = `translate(${constrained.x}px, ${constrained.y}px) scale(1)`;
        setPosition(constrained);
        if (onDragMove) {
          onDragMove(constrained.x + dimensions.width / 2, constrained.y + dimensions.height / 2);
        }
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;
        const newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);
        const newHeight = Math.max(minHeight, resizeStartRef.current.height + deltaY);
        const maxWidth = window.innerWidth - position.x;
        const maxHeight = (maxY || window.innerHeight) - position.y;
        setDimensions({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight),
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        const finalX = e.clientX - dragOffsetRef.current.x;
        const finalY = e.clientY - dragOffsetRef.current.y;
        const constrained = constrainPosition(finalX, finalY);
        setPosition(constrained);
        if (onDragEnd) {
          onDragEnd(constrained.x + dimensions.width / 2, constrained.y + dimensions.height / 2);
        }
        setIsDragging(false);
      }
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.classList.remove('dragging');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    isClosing,
    isAnimating,
    position.x,
    position.y,
    constrainPosition,
    dimensions.width,
    dimensions.height,
    onDragMove,
    onDragEnd,
    minWidth,
    minHeight,
    maxY,
  ]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height,
    };
    if (onFocus) onFocus();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-title-bar')) {
      e.preventDefault();
      dragOffsetRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      setIsDragging(true);
      if (onFocus) onFocus();
      if (onDragStart) onDragStart();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 250);
  };

  useLayoutEffect(() => {
    setPosition({ x: initialX, y: initialY });
    setDimensions({ width: width || 500, height: height || 300 });
    setIsClosing(false);
  }, [initialX, initialY, width, height]);

  return (
    <div
      ref={windowRef}
      className="absolute bg-white border-2 border-black shadow-lg overflow-hidden"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        zIndex,
        willChange: 'transform, opacity',
        transition: (isDragging || isResizing)
          ? 'none'
          : 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease-out',
        transformOrigin: 'center center',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-title-bar bg-black text-white px-4 py-2 flex justify-between items-center select-none cursor-none hoverable">
        <span className="font-bold text-sm">{title}</span>
        <div className="flex gap-1">
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="px-2 py-1 text-xs rounded transition-colors hover:bg-gray-700 hoverable cursor-none"
              aria-label="Agrandir/Restaurer"
            >
              ☐
            </button>
          )}
          {onClose && (
            <button
              onClick={handleClose}
              className="px-2 py-1 text-xs rounded transition-colors hover:bg-gray-700 hoverable cursor-none"
              aria-label="Fermer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div
        className="p-4 overflow-auto transition-opacity duration-300"
        style={{
          height: 'calc(100% - 40px)',
          opacity: isMinimized ? 0 : 1
        }}
      >
        {children}
      </div>

      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-black cursor-se-resize z-10 hoverable"
          onMouseDown={handleResizeStart}
          title="Redimensionner"
          style={{ cursor: 'se-resize' }}
        />
      )}
    </div>
  );
};

export default DragWindow;
