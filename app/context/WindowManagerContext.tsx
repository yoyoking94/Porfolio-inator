"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import type {
    ParcoursDetailData,
    CompetenceDetailData,
    ProjetsDetailData,
    WindowPosition,
} from "@/app/types";

type DynamicWindowData =
    | { type: "parcours-detail"; data: ParcoursDetailData }
    | { type: "competence-detail"; data: CompetenceDetailData }
    | { type: "projet-detail"; data: ProjetsDetailData };

type DynamicWindow = {
    dynamicWindowId: string;
    uniqueKey: string;
    windowData: DynamicWindowData;
    defaultPosition: WindowPosition;
};

type WindowManagerContextType = {
    getWindowZIndex: (windowId: string) => number;
    bringWindowToFront: (windowId: string) => void;
    dynamicWindowList: DynamicWindow[];
    openDynamicWindow: (windowData: DynamicWindowData) => void;
    closeDynamicWindow: (dynamicWindowId: string) => void;
    containerRef: React.RefObject<HTMLElement | null>;
    closeAllDynamicWindows: () => void;
};

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

const FIRST_WINDOW_POSITION_X = 300;
const FIRST_WINDOW_POSITION_Y = 150;
const WINDOW_OFFSET_IN_PIXELS = 30;
const DYNAMIC_WINDOW_DEFAULT_WIDTH = 380;
const DYNAMIC_WINDOW_DEFAULT_HEIGHT = 320;

function generateUniqueKey(windowData: DynamicWindowData): string {
    if (windowData.type === "parcours-detail") {
        const parcoursData = windowData.data;
        if (parcoursData.type === "formation") {
            return `parcours-formation-${parcoursData.formation?.id}`;
        }
        return `parcours-experience-${parcoursData.experience?.id}`;
    }
    if (windowData.type === "competence-detail") {
        const competenceData = windowData.data;
        if (competenceData.type === "technique") {
            return `competence-technique-${competenceData.competenceTechniqueItem?.id}`;
        }
        return `competence-comportementale-${competenceData.competenceComportementale?.id}`;
    }
    if (windowData.type === "projet-detail") {
        return `projet-${windowData.data.repo.id}`;
    }
    return `unknown-${Date.now()}`;
}

function clampPosition(x: number, y: number, containerBounds: DOMRect): WindowPosition {
    const maximumX = containerBounds.width - DYNAMIC_WINDOW_DEFAULT_WIDTH;
    const maximumY = containerBounds.height - DYNAMIC_WINDOW_DEFAULT_HEIGHT;
    return {
        x: Math.min(Math.max(x, containerBounds.left), containerBounds.left + Math.max(maximumX, 0)),
        y: Math.min(Math.max(y, containerBounds.top), containerBounds.top + Math.max(maximumY, 0)),
    };
}

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [highestZIndex, setHighestZIndex] = useState<number>(10);
    const [windowZIndexMap, setWindowZIndexMap] = useState<Record<string, number>>({});
    const [dynamicWindowList, setDynamicWindowList] = useState<DynamicWindow[]>([]);
    const containerRef = useRef<HTMLElement>(null);

    const bringWindowToFront = useCallback((windowId: string) => {
        setHighestZIndex((previousHighestZIndex) => {
            const newHighestZIndex = previousHighestZIndex + 1;
            setWindowZIndexMap((previousWindowZIndexMap) => ({
                ...previousWindowZIndexMap,
                [windowId]: newHighestZIndex,
            }));
            return newHighestZIndex;
        });
    }, []);

    function getWindowZIndex(windowId: string): number {
        return windowZIndexMap[windowId] ?? 10;
    }

    function openDynamicWindow(windowData: DynamicWindowData) {
        const uniqueKey = generateUniqueKey(windowData);

        setDynamicWindowList((previousDynamicWindowList) => {
            const isAlreadyOpen = previousDynamicWindowList.some(
                (dynamicWindow) => dynamicWindow.uniqueKey === uniqueKey
            );

            if (isAlreadyOpen) {
                bringWindowToFront(
                    previousDynamicWindowList.find(
                        (dynamicWindow) => dynamicWindow.uniqueKey === uniqueKey
                    )!.dynamicWindowId
                );
                return previousDynamicWindowList;
            }

            const currentCounter = previousDynamicWindowList.length;
            const newDynamicWindowId = `dynamic-window-${uniqueKey}`;
            const rawX = FIRST_WINDOW_POSITION_X + currentCounter * WINDOW_OFFSET_IN_PIXELS;
            const rawY = FIRST_WINDOW_POSITION_Y + currentCounter * WINDOW_OFFSET_IN_PIXELS;
            const containerBounds = containerRef.current?.getBoundingClientRect();
            const newDefaultPosition = containerBounds
                ? clampPosition(rawX, rawY, containerBounds)
                : { x: rawX, y: rawY };

            return [
                ...previousDynamicWindowList,
                {
                    dynamicWindowId: newDynamicWindowId,
                    uniqueKey,
                    windowData,
                    defaultPosition: newDefaultPosition,
                },
            ];
        });
    }

    function closeDynamicWindow(dynamicWindowId: string) {
        setDynamicWindowList((previousDynamicWindowList) =>
            previousDynamicWindowList.filter(
                (dynamicWindow) => dynamicWindow.dynamicWindowId !== dynamicWindowId
            )
        );
    }

    function closeAllDynamicWindows() {
        setDynamicWindowList([]);
    }

    return (
        <WindowManagerContext.Provider
            value={{
                getWindowZIndex,
                bringWindowToFront,
                dynamicWindowList,
                openDynamicWindow,
                closeDynamicWindow,
                containerRef,
                closeAllDynamicWindows,
            }}
        >
            {children}
        </WindowManagerContext.Provider>
    );
}

export function useWindowManager() {
    const context = useContext(WindowManagerContext);
    if (!context) {
        throw new Error("useWindowManager doit être utilisé à l'intérieur d'un WindowManagerProvider");
    }
    return context;
}
