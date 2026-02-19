'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
    CompetenceComportementale,
    CompetenceTechnique,
    CompetenceTechniqueItem,
} from '@/app/types/database';
import TechIcon from '../TechIcon';

type CompetenceTechniqueDTO = CompetenceTechnique & { items?: CompetenceTechniqueItem[] };

const CompetencesSection = () => {
    const [techniques, setTechniques] = useState<CompetenceTechniqueDTO[] | null>(null);
    const [comportementales, setComportementales] = useState<CompetenceComportementale[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setError(null);
                const [techRes, compRes] = await Promise.all([
                    fetch('/api/db/techniques', { method: 'GET' }),
                    fetch('/api/db/comportementales', { method: 'GET' }),
                ]);
                if (!techRes.ok) throw new Error(`Techniques HTTP ${techRes.status}`);
                if (!compRes.ok) throw new Error(`Comportementales HTTP ${compRes.status}`);

                const techJson = (await techRes.json()) as { competencesTechniques: CompetenceTechniqueDTO[] };
                const compJson = (await compRes.json()) as { competencesComportementales: CompetenceComportementale[] };

                if (!cancelled) {
                    setTechniques(techJson.competencesTechniques);
                    setComportementales(compJson.competencesComportementales);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : 'Erreur inconnue');
                    setTechniques([]);
                    setComportementales([]);
                }
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    const hasAny = useMemo(
        () => (techniques && techniques.length > 0) || (comportementales && comportementales.length > 0),
        [techniques, comportementales]
    );

    return (
        <section className="space-y-4 h-full">
            <h2 className="text-pixel-lg">Compétences</h2>
            {error && <p className="text-pixel-xs text-red-600">Erreur: {error}</p>}
            {(techniques === null || comportementales === null) && (
                <p className="text-pixel-xs">Chargement…</p>
            )}

            {hasAny && (
                <div className="space-y-4">

                    {/* ── Techniques : onglets + grille ── */}
                    {techniques && techniques.length > 0 && (
                        <div>
                            <h3 className="text-pixel-base font-bold mb-2">Techniques</h3>

                            {/* Onglets */}
                            <div className="flex flex-wrap border-b-2 border-black mb-3">
                                {techniques.map((cat, i) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(i)}
                                        className={`px-3 py-1 text-pixel-xs border-r-2 border-black transition-colors cursor-none hoverable
                                            ${activeTab === i
                                                ? 'bg-black text-white'
                                                : 'bg-white text-black hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat.categorie}
                                    </button>
                                ))}
                            </div>

                            {/* Grille d'icônes */}
                            <div className="grid grid-cols-6 gap-3 p-2 border-2 border-black min-h-[80px]">
                                {(techniques[activeTab]?.items || []).map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative group flex flex-col items-center justify-center"
                                    >
                                        <TechIcon name={item.nom} className="w-10 h-10" />

                                        {/* Tooltip au survol */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2
                                                        hidden group-hover:flex flex-col items-center
                                                        bg-black text-white px-2 py-1 z-50
                                                        whitespace-nowrap border border-white pointer-events-none">
                                            <span className="text-[9px]">{item.nom}</span>
                                            {/* Barre de niveau */}
                                            <div className="flex gap-0.5 mt-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-2 border border-white
                                                            ${i < item.niveau ? 'bg-white' : 'bg-transparent'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Comportementales : tags ── */}
                    {comportementales && comportementales.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-pixel-sm font-bold">Comportementales</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {comportementales.map((c) => (
                                    <span
                                        key={c.id}
                                        className="bg-black text-white px-2 py-1 text-[10px] border-2 border-black leading-tight"
                                    >
                                        {c.nom}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {!hasAny && techniques !== null && (
                <p className="text-pixel-xs">Aucune compétence trouvée.</p>
            )}
        </section>
    );
};

export default CompetencesSection;
