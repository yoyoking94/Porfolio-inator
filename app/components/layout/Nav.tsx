"use client";

import type { WindowConfig } from "@/app/types";
import { useWindowManager } from "@/app/context/WindowManagerContext";
import Image from "next/image";

type NavProps = {
    windowConfigList: WindowConfig[];
    openWindowMap: Record<string, boolean>;
    onOpenWindow: (windowId: string) => void;
    onCloseAllWindows: () => void;
};

export default function Nav({
    windowConfigList,
    openWindowMap,
    onOpenWindow,
    onCloseAllWindows,
}: NavProps) {
    const { dynamicWindowList, closeAllDynamicWindows } = useWindowManager();

    // Ferme toutes les fenêtres : principales + dynamiques
    function handleCloseAll() {
        closeAllDynamicWindows();
        onCloseAllWindows();
    }

    // Le bouton n'est visible que si au moins une fenêtre est ouverte
    const hasAnyWindowOpen =
        Object.values(openWindowMap).some(Boolean) ||
        dynamicWindowList.length > 0;

    return (
        <nav
            className="
        fixed bottom-0 left-0 right-0
        flex items-center justify-center
        flex-wrap gap-1
        px-4 py-2
        min-h-[8dvh]
      "
        >
            {/* ── Bouton fermer tout ───────────────────────────────── */}
            {hasAnyWindowOpen && (
                <button
                    onClick={handleCloseAll}
                    aria-label="Fermer toutes les fenêtres"
                    className="
                    absolute top-10 right-10
            w-2 h-2 bg-black
            cursor-none hoverable
            flex-shrink-0
          "
                />
            )}

            {/* ── Icônes des fenêtres principales ─────────────────── */}
            {windowConfigList.map((windowConfig) => {
                const isWindowOpen = openWindowMap[windowConfig.windowId] ?? false;

                return (
                    <button
                        key={windowConfig.windowId}
                        onClick={() => onOpenWindow(windowConfig.windowId)}
                        aria-label={windowConfig.windowTitle}
                        aria-pressed={isWindowOpen}
                        className="
              border-2 border-black bg-white
              p-2 sm:p-1
              hoverable cursor-none
              flex items-center justify-center
            "
                    >
                        <Image
                            src={windowConfig.windowIcon.src}
                            alt=""
                            width={18}
                            height={18}
                            className="block w-5 h-5 sm:w-4 sm:h-4 transition-all"
                            style={{
                                filter: isWindowOpen
                                    ? "brightness(0) opacity(0.3)"
                                    : "brightness(0)",
                            }}
                        />
                    </button>
                );
            })}
        </nav>
    );
}
