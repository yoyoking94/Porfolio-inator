"use client";

import { useState, useRef, useEffect } from "react";
import type { WindowPosition, WindowSize } from "@/app/types";

const MINIMUM_WINDOW_WIDTH = 250;
const MINIMUM_WINDOW_HEIGHT = 150;

export function useDragAndResize(
    defaultPosition: WindowPosition,
    defaultSize: WindowSize,
    containerRef: React.RefObject<HTMLElement | null>
) {
    const [position, setPosition] = useState<WindowPosition>(defaultPosition);
    const [size, setSize] = useState<WindowSize>(defaultSize);

    const positionRef = useRef<WindowPosition>(defaultPosition);
    const sizeRef = useRef<WindowSize>(defaultSize);

    useEffect(() => { positionRef.current = position; }, [position]);
    useEffect(() => { sizeRef.current = size; }, [size]);

    // ── Drag ──────────────────────────────────────────────────
    const isDraggingRef = useRef<boolean>(false);
    const mouseOffsetRef = useRef<WindowPosition>({ x: 0, y: 0 });

    function handleMouseDownOnTitleBar(event: React.MouseEvent) {
        isDraggingRef.current = true;
        mouseOffsetRef.current = {
            x: event.clientX - positionRef.current.x,
            y: event.clientY - positionRef.current.y,
        };
        document.body.style.userSelect = "none";
    }

    // ── Resize ────────────────────────────────────────────────
    const isResizingRef = useRef<boolean>(false);
    const resizeStartRef = useRef({
        mouseX: 0,
        mouseY: 0,
        windowWidth: defaultSize.width,
        windowHeight: defaultSize.height,
    });

    function handleMouseDownOnResizeHandle(event: React.MouseEvent) {
        event.preventDefault();
        isResizingRef.current = true;
        resizeStartRef.current = {
            mouseX: event.clientX,
            mouseY: event.clientY,
            windowWidth: sizeRef.current.width,
            windowHeight: sizeRef.current.height,
        };
        document.body.style.userSelect = "none";
    }

    // ── Listeners partagés ────────────────────────────────────
    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            const containerBounds = containerRef.current?.getBoundingClientRect();

            if (isDraggingRef.current) {
                let newX = event.clientX - mouseOffsetRef.current.x;
                let newY = event.clientY - mouseOffsetRef.current.y;

                if (containerBounds) {
                    const minimumX = containerBounds.left;
                    const minimumY = containerBounds.top;
                    // containerBounds.bottom est déjà le bas du <main>
                    // la nav est en dehors du <main> — pas besoin de la soustraire
                    const maximumX = containerBounds.right - sizeRef.current.width;
                    const maximumY = containerBounds.bottom - sizeRef.current.height;

                    newX = Math.min(Math.max(newX, minimumX), maximumX);
                    newY = Math.min(Math.max(newY, minimumY), maximumY);
                }

                setPosition({ x: newX, y: newY });
            }

            if (isResizingRef.current) {
                const requestedWidth =
                    resizeStartRef.current.windowWidth +
                    (event.clientX - resizeStartRef.current.mouseX);
                const requestedHeight =
                    resizeStartRef.current.windowHeight +
                    (event.clientY - resizeStartRef.current.mouseY);

                let newWidth = Math.max(MINIMUM_WINDOW_WIDTH, requestedWidth);
                let newHeight = Math.max(MINIMUM_WINDOW_HEIGHT, requestedHeight);

                if (containerBounds) {
                    const maximumWidth = containerBounds.right - positionRef.current.x;
                    const maximumHeight = containerBounds.bottom - positionRef.current.y;
                    newWidth = Math.min(newWidth, maximumWidth);
                    newHeight = Math.min(newHeight, maximumHeight);
                }

                setSize({ width: newWidth, height: newHeight });
            }
        }

        function handleMouseUp() {
            isDraggingRef.current = false;
            isResizingRef.current = false;
            document.body.style.userSelect = "";
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
        };
    }, [containerRef]);

    return { position, size, handleMouseDownOnTitleBar, handleMouseDownOnResizeHandle };
}
