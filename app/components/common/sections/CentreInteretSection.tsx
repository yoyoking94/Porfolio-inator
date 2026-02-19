'use client';

import { createPortal } from 'react-dom';
import { useParcoursWindows } from '@/app/hooks/useParcoursWindows';
import DragWindow from '../../layout/DragWindow';
import SteamLibrary from '../../features/SteamLibrary';
import AstronomieSection from '../../features/AstronomieSection';
import MotorSportSection from '../../features/MotorSportSection';
import FilmsSection from '../../features/CinemaSection';
interface CentreInteret {
    id: number;
    nom: string;
}

const DETAIL_COMPONENTS: Partial<Record<string, React.ReactNode>> = {
    'Jeux Vidéo': <SteamLibrary />,
    'Astronomie': <AstronomieSection />,
    'Sport automobile': <MotorSportSection />,
    'Cinéma': <FilmsSection />

};

const DETAIL_SIZE: Partial<Record<string, { width: number; height: number }>> = {
    'Jeux Vidéo': { width: 480, height: 500 },
    'Astronomie': { width: 480, height: 500 },
    'Sport automobile': { width: 480, height: 500 },
    'Cinéma': { width: 480, height: 500 },
};

interface Props {
    centresInteret: CentreInteret[];
}

export default function CentresInteretSection({ centresInteret }: Props) {
    const windows = useParcoursWindows<CentreInteret>();

    return (
        <div className="flex flex-wrap gap-1.5">
            {centresInteret.map((c) => {
                const hasDetail = !!DETAIL_COMPONENTS[c.nom];
                return (
                    <span
                        key={c.id}
                        onClick={() => hasDetail && windows.open(c)}
                        className={`bg-black text-white px-2 py-1 text-[10px] border-2 border-black leading-tight
                            ${hasDetail ? 'cursor-none hoverable hover:bg-gray-800 transition-colors' : ''}`}
                        title={hasDetail ? `Voir ${c.nom}` : undefined}
                    >
                        {c.nom} {hasDetail && '↗'}
                    </span>
                );
            })}

            {/* DragWindows portals */}
            {windows.opened.map((centre, index) => {
                const content = DETAIL_COMPONENTS[centre.nom];
                const size = DETAIL_SIZE[centre.nom] ?? { width: 480, height: 400 };
                if (!content) return null;
                return createPortal(
                    <div key={centre.id} onMouseDown={(e) => e.stopPropagation()}>
                        <DragWindow
                            title={centre.nom}
                            initialX={100 + index * 28}
                            initialY={100 + index * 28}
                            width={size.width}
                            height={size.height}
                            zIndex={999 + index}
                            onClose={() => windows.close(centre.id)}
                        >
                            {content}
                        </DragWindow>
                    </div>,
                    document.body
                );
            })}
        </div>
    );
}
