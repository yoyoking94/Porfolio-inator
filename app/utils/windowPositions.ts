export const NAV_HEIGHT = 80;
export const MINIMIZED_WIDTH = 200;
export const MINIMIZED_HEIGHT = 60;
export const MINIMIZED_MARGIN = 10;
export const VERTICAL_OFFSET = 120;

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

export const getInitialPosition = (
    id: number,
    windowW: number,
    windowH: number,
    screenSize: ScreenSize
): Position => {
    const screenWidth = screenSize.width;
    const screenHeight = screenSize.height;
    const margin = 20;
    const availableHeight = screenHeight - NAV_HEIGHT;

    // Mobile : centrer verticalement avec décalage
    if (screenWidth < 768) {
        const safeWidth = Math.min(windowW, screenWidth - 40);
        return {
            x: (screenWidth - safeWidth) / 2,
            y: Math.min(margin + (id - 1) * 80 + VERTICAL_OFFSET, availableHeight - windowH - margin),
            width: safeWidth,
            height: windowH,
        };
    }

    // Desktop : positions prédéfinies
    let centerX = 0;
    let centerY = 0;

    if (id === 1) {
        centerX = screenWidth / 2;
        centerY = availableHeight / 2 + VERTICAL_OFFSET;
    } else if (id === 2) {
        centerX = margin + 250;
        centerY = margin + 175 + VERTICAL_OFFSET;
    } else if (id === 3) {
        centerX = screenWidth - margin - 250;
        centerY = margin + 175 + VERTICAL_OFFSET;
    } else if (id === 4) {
        centerX = margin + 300;
        centerY = availableHeight - 310 - margin + VERTICAL_OFFSET;
    } else if (id === 5) {
        centerX = screenWidth - margin - 200;
        centerY = availableHeight - 230 - margin + VERTICAL_OFFSET;
    }

    const x = Math.max(
        margin,
        Math.min(centerX - windowW / 2, screenWidth - windowW - margin)
    );
    const y = Math.max(
        margin,
        Math.min(centerY - windowH / 2, availableHeight - windowH - margin)
    );

    return { x, y, width: windowW, height: windowH };
};

export const getMinimizedPosition = (index: number): Position => {
    return {
        x: MINIMIZED_MARGIN,
        y: NAV_HEIGHT + 60 + MINIMIZED_MARGIN + index * (MINIMIZED_HEIGHT + MINIMIZED_MARGIN),
        width: MINIMIZED_WIDTH,
        height: MINIMIZED_HEIGHT,
    };
};
