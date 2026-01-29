import { useState, useLayoutEffect } from 'react';
import { getInitialPosition, getMinimizedPosition, NAV_HEIGHT } from '../utils/windowPositions';

export interface WindowState {
    id: number;
    title: string;
    visible: boolean;
    zIndex: number;
    width: number;
    height: number;
    isMinimized: boolean;
    x?: number; // Position X personnalisée
    y?: number; // Position Y personnalisée
}


const INITIAL_WINDOWS: WindowState[] = [
    { id: 1, title: 'A PROPOS DE MOI', visible: true, zIndex: 5, width: 500, height: 400, isMinimized: false },
    { id: 2, title: 'PARCOURS', visible: false, zIndex: 2, width: 450, height: 350, isMinimized: false },
    { id: 3, title: 'COMPETENCES', visible: false, zIndex: 3, width: 400, height: 300, isMinimized: false },
    { id: 4, title: 'PROJETS', visible: false, zIndex: 4, width: 600, height: 450, isMinimized: false },
    { id: 5, title: 'CONTACT', visible: false, zIndex: 1, width: 550, height: 380, isMinimized: false },
  ];

export const useWindowManager = () => {
    const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
    const [maxZIndex, setMaxZIndex] = useState(5);
    const [globalMinimized, setGlobalMinimized] = useState(false);
    const [draggedWindowId, setDraggedWindowId] = useState<number | null>(null);
    const [showExpandHint, setShowExpandHint] = useState(false);
    const [screenSize, setScreenSize] = useState({
        // IMPORTANT: keep SSR + first client render deterministic to avoid hydration mismatch.
        width: 1200,
        height: 800,
    });

    useLayoutEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();
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
            prevWindows.map((w) => {
                if (w.id === id) {
                    if (globalMinimized && !w.isMinimized) {
                        return { ...w, isMinimized: true };
                    }
                    return { ...w, visible: false };
                }
                return w;
            })
        );
    };

    const handleWindowFocus = (id: number) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setWindows((prevWindows) =>
            prevWindows.map((w) => (w.id === id ? { ...w, zIndex: newZIndex } : w))
        );
    };

    const toggleMinimizeAll = () => {
        const newMinimizedState = !globalMinimized;
        setGlobalMinimized(newMinimizedState);

        setWindows((prevWindows) =>
            prevWindows.map((w) => {
                // Retrouver les dimensions initiales de la fenêtre
                const initialWindow = INITIAL_WINDOWS.find((iw) => iw.id === w.id);

                return {
                    ...w,
                    isMinimized: newMinimizedState,
                    // Si on passe en mode NORMAL (newMinimizedState = false), réinitialiser les dimensions
                    width: newMinimizedState === false ? (initialWindow?.width || w.width) : w.width,
                    height: newMinimizedState === false ? (initialWindow?.height || w.height) : w.height,
                    x: newMinimizedState === false ? undefined : w.x,  // Réinitialiser position si mode normal
                    y: newMinimizedState === false ? undefined : w.y
                };
            })
        );
    };



    const handleDragMove = (id: number, x: number, y: number) => {
        if (globalMinimized) {
            setDraggedWindowId(id);

            const draggedWindow = windows.find((w) => w.id === id);
            if (draggedWindow?.isMinimized) {
                const centerX = screenSize.width / 2;
                const centerY = screenSize.height / 2;
                const distanceFromCenter = Math.sqrt(
                    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
                );

                if (distanceFromCenter < 800) {
                    setShowExpandHint(true);
                } else {
                    setShowExpandHint(false);
                }
            }
        } else {
            setShowExpandHint(false);
        }
    };

    const handleDragEnd = (id: number, x: number, y: number) => {
        setDraggedWindowId(null);

        if (globalMinimized && showExpandHint) {
            const centerX = screenSize.width / 2;
            const centerY = screenSize.height / 2;
            const distanceFromCenter = Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );

            if (distanceFromCenter < 400) {
                setWindows((prevWindows) =>
                    prevWindows.map((w) => {
                        if (w.id === id) {
                            // Taille uniforme pour toutes les fenêtres agrandies
                            const newWidth = 750;  // Taille fixe
                            const newHeight = 550; // Taille fixe

                            // Calculer la position centrée
                            const centeredX = (screenSize.width - newWidth) / 2;
                            const centeredY = (screenSize.height - NAV_HEIGHT - newHeight) / 2 + NAV_HEIGHT;

                            return {
                                ...w,
                                isMinimized: false,
                                width: newWidth,
                                height: newHeight,
                                x: centeredX,
                                y: centeredY
                            };
                        }
                        return w;
                    })
                );
            }
            setShowExpandHint(false);
        }
    };


    return {
        windows,
        globalMinimized,
        draggedWindowId,
        showExpandHint,
        screenSize,
        toggleWindow,
        closeWindow,
        handleWindowFocus,
        toggleMinimizeAll,
        handleDragMove,
        handleDragEnd,
        getInitialPosition: (id: number, windowW: number, windowH: number) => {
            const position = getInitialPosition(id, windowW, windowH, screenSize);

            // Si la fenêtre vient d'être agrandie depuis l'état minimisé, centrer
            const window = windows.find(w => w.id === id);
            if (window && !window.isMinimized && draggedWindowId === id) {
                return {
                    ...position,
                    x: (screenSize.width - windowW) / 2,
                    y: (screenSize.height - NAV_HEIGHT - windowH) / 2 + NAV_HEIGHT,
                };
            }

            return position;
        },
        getMinimizedPosition,
    };
};
