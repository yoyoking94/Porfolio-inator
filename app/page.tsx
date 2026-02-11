"use client"

import Nav from "./components/common/Nav";
import { useWindowManager } from "./hooks/useWindowManager";
import { windowContentMap } from "./utils/windowContent";
import CustomCursor from "./components/common/CustomCursor";
import DragWindow from "./components/layout/DragWindow";


export default function Home() {
  const {
    windows,
    navWindows,
    screenSize,
    toggleWindow,
    closeWindow,
    handleWindowFocus,
    toggleMaximize,
    getWindowPosition,
  } = useWindowManager();

  return (
    <>
      <CustomCursor />

      {windows.map((window) => {
        if (!window.visible) return null;
        const position = getWindowPosition(window);
        const ContentComponent = windowContentMap[window.id];

        return (
          <DragWindow
            key={`${window.id}-${window.visible}`}
            title={window.title}
            initialX={position.x}
            initialY={position.y}
            width={position.width}
            height={position.height}
            maxY={screenSize.height - 80}
            onClose={() => closeWindow(window.id)}
            onMaximize={() => toggleMaximize(window.id)}
            onFocus={() => handleWindowFocus(window.id)}
            zIndex={window.zIndex}
          >
            {ContentComponent ? <ContentComponent /> : <p>Contenu non trouvé</p>}
          </DragWindow>
        );
      })}

      <Nav windows={navWindows} onToggleWindow={toggleWindow} />
    </>
  );
}
