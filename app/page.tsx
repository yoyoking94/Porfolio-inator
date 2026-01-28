"use client"

import dynamic from 'next/dynamic';
import Nav from './components/common/Nav';
import { useWindowManager } from './hooks/useWindowManager';
import { windowContentMap } from './utils/windowContent';
import { NAV_HEIGHT } from './utils/windowPositions';

const CustomCursor = dynamic(() => import('./components/common/CustomCursor'), {
  ssr: false,
  loading: () => null
})

const DragWindow = dynamic(() => import('./components/layout/DragWindow'), {
  ssr: false,
})

export default function Home() {
  const {
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
    getInitialPosition,
    getMinimizedPosition,
  } = useWindowManager();

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Bouton carré en bas à gauche */}
      <button
        onClick={toggleMinimizeAll}
        className="fixed bottom-0 left-0 z-50 w-3 h-3 bg-black border-2 border-white hover:bg-gray-800 transition-colors flex items-center justify-center hoverable cursor-none"
        style={{ left: '3%', bottom: '3%', transform: 'translateX(-50%)' }}
        aria-label={globalMinimized ? 'Restaurer toutes les fenêtres' : 'Minimiser toutes les fenêtres'}
      >
        <span className="text-white text-2xl"></span>
      </button>

      {/* Rectangle indicateur d'agrandissement */}
      {showExpandHint && draggedWindowId && (() => {
        const originalWindow = windows.find((w) => w.id === draggedWindowId);
        return (
          <div
            className="fixed pointer-events-none z-40 border border-black/30 bg-transparent transition-opacity"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${originalWindow?.width || 500}px`,
              height: `${originalWindow?.height || 400}px`,
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="bg-black/70 text-white/90 px-2 py-1 text-xs font-mono">
                Relâcher pour agrandir
              </div>
            </div>
          </div>
        );
      })()}

      {windows.map((window, index) => {
        const position = window.isMinimized
          ? getMinimizedPosition(index)
          : (window.x !== undefined && window.y !== undefined)
            ? { x: window.x, y: window.y, width: window.width, height: window.height }
            : getInitialPosition(window.id, window.width, window.height);


        const ContentComponent = windowContentMap[window.id];

        return window.visible ? (
          <DragWindow
            key={window.id}
            title={window.title}
            initialX={position.x}
            initialY={position.y}
            width={position.width}
            height={position.height}
            maxY={screenSize.height - NAV_HEIGHT}
            onClose={() => closeWindow(window.id)}
            onFocus={() => handleWindowFocus(window.id)}
            onDragMove={(x, y) => handleDragMove(window.id, x, y)}
            onDragEnd={(x, y) => handleDragEnd(window.id, x, y)}
            zIndex={window.zIndex}
            isMinimized={window.isMinimized}
          >
            {ContentComponent ? <ContentComponent /> : <p>Contenu non trouvé</p>}
          </DragWindow>
        ) : null;
      })}

      <Nav windows={windows} onToggleWindow={toggleWindow} />
    </>
  );
}
