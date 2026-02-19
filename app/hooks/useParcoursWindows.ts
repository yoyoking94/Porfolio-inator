// hooks/useParcoursWindows.ts
import { useState } from 'react';

export function useParcoursWindows<T extends { id: number }>() {
    const [opened, setOpened] = useState<T[]>([]);

    const open = (item: T) => {
        if (opened.find((i) => i.id === item.id)) return;
        setOpened((prev) => [...prev, item]);
    };

    const close = (id: number) => {
        setOpened((prev) => prev.filter((i) => i.id !== id));
    };

    return { opened, open, close };
}
