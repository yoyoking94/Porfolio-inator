"use client"

import { useState, useLayoutEffect } from "react";
import { getCascadePosition } from "../utils/windowPositions";

export interface WindowState {
    id: number;
    title: string;
    visible: boolean;
    zIndex: number;
    x: number;
    y: number;
    isMaximized: boolean;
    maxX: number;
    maxY: number;
}

export interface NavWindow {
    id: number;
    title: string;
    visible: boolean;
}

const INITIAL_WINDOWS: WindowState[] = [
    { id: 1, title: 'A PROPOS DE MOI', visible: true, zIndex: 5, x: 0, y: 0, isMaximized: false, maxX: 0, maxY: 0 },
    { id: 2, title: 'PARCOURS', visible: true, zIndex: 4, x: 0, y: 0, isMaximized: false, maxX: 0, maxY: 0 },
    { id: 3, title: 'COMPETENCES', visible: true, zIndex: 3, x: 0, y: 0, isMaximized: false, maxX: 0, maxY: 0 },
    { id: 4, title: 'PROJETS', visible: true, zIndex: 2, x: 0, y: 0, isMaximized: false, maxX: 0, maxY: 0 },
    { id: 5, title: 'CONTACT', visible: true, zIndex: 1, x: 0, y: 0, isMaximized: false, maxX: 0, maxY: 0 },
];

export const useWindowManager = () => {
    const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
    const [maxZIndex, setMaxZIndex] = useState(5);
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800,
    });

    useLayoutEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleWindow = (id: number) => {
        setWindows((prevWindows) =>
            prevWindows.map((w) => {
                if (w.id === id) {
                    if (!w.visible) {
                        const newZIndex = maxZIndex + 1;
                        setMaxZIndex(newZIndex);
                        return { ...w, visible: true, zIndex: newZIndex };
                    }
                    return { ...w, visible: false };
                }
                return w;
            })
        );
    };

    const closeWindow = (id: number) => {
        setWindows((prevWindows) =>
            prevWindows.map((w) => (w.id === id ? { ...w, visible: false } : w))
        );
    };

    const handleWindowFocus = (id: number) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setWindows((prevWindows) =>
            prevWindows.map((w) => (w.id === id ? { ...w, zIndex: newZIndex } : w))
        );
    };

    const toggleMaximize = (id: number) => {
        setWindows((prevWindows) =>
            prevWindows.map((w) => {
                if (w.id === id) {
                    if (w.isMaximized) {
                        // Restaurer position cascade
                        const cascadePos = getCascadePosition(id, screenSize);
                        return {
                            ...w,
                            isMaximized: false,
                            x: cascadePos.x,
                            y: cascadePos.y,
                            maxX: 0,
                            maxY: 0,
                        };
                    } else {
                        return {
                            ...w,
                            isMaximized: true,
                            maxX: screenSize.width,
                            maxY: screenSize.height - 80,
                        };
                    }
                }
                return w;
            })
        );
    };

    const getWindowPosition = (window: WindowState): { x: number; y: number; width: number; height: number } => {
        if (window.isMaximized) {
            return {
                x: 0,
                y: 0,
                width: window.maxX,
                height: window.maxY,
            };
        }
        const cascadePos = getCascadePosition(window.id, screenSize);
        return {
            x: window.x || cascadePos.x,
            y: window.y || cascadePos.y,
            width: 620,
            height: 520,
        };
    };

    return {
        windows,
        screenSize,
        toggleWindow,
        closeWindow,
        handleWindowFocus,
        toggleMaximize,
        getWindowPosition,
        navWindows: windows.map(w => ({ id: w.id, title: w.title, visible: w.visible })) as NavWindow[]
    };
};
