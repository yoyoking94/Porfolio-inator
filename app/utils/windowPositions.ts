export const WINDOW_WIDTH = 520;
export const WINDOW_HEIGHT = 420;
export const NAV_HEIGHT = 80;
export const CASCADE_OFFSET_X = 30;
export const CASCADE_OFFSET_Y = 30;

interface ScreenSize {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCascadePosition = (id: number, screenSize: ScreenSize): Position => {
  const margin = 20;
  const maxX = screenSize.width - WINDOW_WIDTH - margin;
  const maxY = screenSize.height - WINDOW_HEIGHT - NAV_HEIGHT - margin;

  const reversedIndex = 6 - id;
  
  const x = Math.max(margin, Math.min(CASCADE_OFFSET_X * reversedIndex, maxX));
  const y = Math.max(margin, Math.min(CASCADE_OFFSET_Y * reversedIndex, maxY));

  return {
    x,
    y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  };
};
