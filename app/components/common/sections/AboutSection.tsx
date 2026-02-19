'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CentreInteret, Langue, Profil } from '@/app/types/database';
import { useParcoursWindows } from '@/app/hooks/useParcoursWindows';
import DragWindow from '../../layout/DragWindow';
import AstronomieSection from '../../features/AstronomieSection';
import MotorSportSection from '../../features/MotorSportSection';
import SteamLibrary from '../../features/SteamLibrary';
import FilmsSection from '../../features/CinemaSection';

type ProfilDTO = Omit<Profil, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
};

const INTERET_COMPONENTS: Record<string, React.ReactNode> = {
    'Jeux Vidéo': <SteamLibrary />,
    'Astronomie': <AstronomieSection />,
    'Sport automobile': <MotorSportSection />,
    'Cinéma': <FilmsSection />,
};

const AboutSection = () => {
    const [profilData, setProfilData] = useState<ProfilDTO | null>(null);
    const [langues, setLangues] = useState<Langue[] | null>(null);
    const [centresInteret, setCentresInteret] = useState<CentreInteret[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const interets = useParcoursWindows<CentreInteret>();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setError(null);
                const [profilRes, languesRes, centresRes] = await Promise.all([
                    fetch('/api/db/profil', { method: 'GET' }),
                    fetch('/api/db/langues', { method: 'GET' }),
                    fetch('/api/db/centreInteret', { method: 'GET' }),
                ]);

                if (!profilRes.ok) throw new Error(`Profil HTTP ${profilRes.status}`);
                if (!languesRes.ok) throw new Error(`Langues HTTP ${languesRes.status}`);
                if (!centresRes.ok) throw new Error(`Centres d'intérêt HTTP ${centresRes.status}`);

                const profilJson = (await profilRes.json()) as { profil: ProfilDTO };
                const languesJson = (await languesRes.json()) as { langues: Langue[] };
                const centresJson = (await centresRes.json()) as { centresInteret: CentreInteret[] };

                if (!cancelled) {
                    setProfilData(profilJson.profil);
                    setLangues(languesJson.langues);
                    setCentresInteret(centresJson.centresInteret);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : 'Erreur inconnue');
                    setProfilData(null);
                    setLangues([]);
                    setCentresInteret([]);
                }
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">À propos de moi</h2>
            {error && <p className="text-pixel-xs">Erreur: {error}</p>}

            {profilData ? (
                <div className="space-y-2">
                    <p className="text-pixel-sm">
                        <strong>{profilData.prenom} {profilData.nom}</strong>
                        {profilData.poste_actuel ? ` — ${profilData.poste_actuel}` : ''}
                    </p>
                    {profilData.localisation && (
                        <p className="text-pixel-xs">Localisation : {profilData.localisation}</p>
                    )}
                    {profilData.recherche && (
                        <p className="text-pixel-xs">Recherche : {profilData.recherche}</p>
                    )}
                </div>
            ) : (
                <p className="text-pixel-sm">
                    Je suis un alternant passionné par le développement web...
                </p>
            )}

            {langues && langues.length > 0 && (
                <div className="space-y-1">
                    <h3 className="text-pixel-sm font-bold">Langues</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {langues.map((l) => (
                            <li key={l.id} className="text-pixel-xs">
                                {l.langue} — {l.niveau}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {centresInteret && centresInteret.length > 0 && (
                <div className="space-y-1">
                    <h3 className="text-pixel-sm font-bold">Centres d&apos;intérêt</h3>
                    <div className="flex flex-wrap gap-2">
                        {centresInteret.map((c) => {
                            const hasDetail = c.nom in INTERET_COMPONENTS;
                            return (
                                <span
                                    key={c.id}
                                    onClick={() => hasDetail && interets.open(c)}
                                    className={`bg-black text-white px-2 py-1 text-pixel-xs transition-opacity
                                        ${hasDetail ? 'cursor-none hoverable hover:opacity-75' : ''}`}
                                >
                                    {c.nom}
                                    {hasDetail && (
                                        <span className="ml-1 text-[9px] opacity-60">↗</span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── DragWindows centres d'intérêt ── */}
            {interets.opened.map((interet, index) => createPortal(
                <div key={interet.id} onMouseDown={(e) => e.stopPropagation()}>
                    <DragWindow
                        title={interet.nom}
                        initialX={100 + index * 28}
                        initialY={100 + index * 28}
                        width={560}
                        height={420}
                        zIndex={999 + index}
                        onClose={() => interets.close(interet.id)}
                    >
                        {INTERET_COMPONENTS[interet.nom]}
                    </DragWindow>
                </div>,
                document.body
            ))}
        </section>
    );
};

export default AboutSection;
