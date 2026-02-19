// components/common/sections/parcours/ParcoursDetailWindow.tsx
import DragWindow from '@/app/components/layout/DragWindow';
import { createPortal } from 'react-dom';

interface ParcoursDetailWindowProps {
    title: string;
    index: number;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ParcoursDetailWindow({ title, index, onClose, children }: ParcoursDetailWindowProps) {
    return createPortal(
        <div onMouseDown={(e) => e.stopPropagation()}>
            <DragWindow
                title={title}
                initialX={120 + index * 28}
                initialY={120 + index * 28}
                width={520}
                height={340}
                zIndex={999 + index}
                onClose={onClose}
            >
                {children}
            </DragWindow>
        </div>,
        document.body
    );
}
