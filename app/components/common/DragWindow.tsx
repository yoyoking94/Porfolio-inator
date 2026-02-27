"use client";

import { useEffect, useState } from "react";
import { useDragAndResize } from "@/app/hooks/useDragAndResize";
import { useWindowManager } from "@/app/context/WindowManagerContext";
import type { DragWindowProps } from "@/app/types";

const DESKTOP_BREAKPOINT_IN_PIXELS = 768;

export default function DragWindow({
    windowId,
    windowTitle,
    children,
    isOpen,
    onClose,
    containerRef,
    defaultPosition = { x: 100, y: 100 },
    defaultSize = { width: 400, height: 300 },
    maxSize,
}: DragWindowProps) {
    const { getWindowZIndex, bringWindowToFront } = useWindowManager();

    const { position, size, handleMouseDownOnTitleBar, handleMouseDownOnResizeHandle } =
        useDragAndResize(defaultPosition, defaultSize, containerRef);
    //                                                              ↑
    //                          On ne passe plus maxSize au hook — on le gère ici

    const [isDesktop, setIsDesktop] = useState<boolean>(
        typeof window !== "undefined"
            ? window.innerWidth >= DESKTOP_BREAKPOINT_IN_PIXELS
            : true
    );

    useEffect(() => {
        function handleWindowResize() {
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT_IN_PIXELS);
        }
        window.addEventListener("resize", handleWindowResize);

        if (isOpen) {
            bringWindowToFront(windowId);
        }

        return () => window.removeEventListener("resize", handleWindowResize);
    }, [isOpen, bringWindowToFront, windowId]);


    if (!isOpen) return null;

    const displayWidth = maxSize ? Math.min(size.width, maxSize.width) : size.width;
    const displayHeight = maxSize ? Math.min(size.height, maxSize.height) : size.height;

    return (
        <div
            role="dialog"
            aria-label={windowTitle}
            onMouseDown={() => bringWindowToFront(windowId)}
            style={
                isDesktop
                    ? {
                        left: position.x,
                        top: position.y,
                        width: displayWidth,
                        height: displayHeight,
                        zIndex: getWindowZIndex(windowId),
                    }
                    : {}
            }
            className="
        flex flex-col border-2 border-black bg-white overflow-hidden
        w-full mb-4
        md:fixed md:w-auto md:mb-0
      "
        >
            {/* ── Barre de titre ───────────────────────────────────── */}
            <div
                onMouseDown={isDesktop ? handleMouseDownOnTitleBar : undefined}
                className="flex shrink-0 items-center justify-between bg-black px-2 py-1 hoverable"
            >
                <h1 className="text-white text-xs uppercase tracking-widest">
                    {windowTitle}
                </h1>
                <button
                    onClick={onClose}
                    aria-label="Fermer la fenêtre"
                    className="px-1 text-white cursor-none"
                >
                    X
                </button>
            </div>

            {/* ── Contenu (scrollable) ─────────────────────────────── */}
            <div className="flex-1 overflow-auto p-3 text-black text-xs min-h-[200px] md:min-h-0">
                {children}
            </div>

            {/* ── Poignée de redimensionnement ─────────────────────── */}
            {isDesktop && (
                <div
                    onMouseDown={handleMouseDownOnResizeHandle}
                    aria-label="Redimensionner la fenêtre"
                    className="absolute bottom-0 right-0 w-3 h-3 bg-black flex items-center justify-center hoverable"
                >
                    <span className="text-white text-[8px] leading-none select-none"></span>
                </div>
            )}
        </div>
    );
}
