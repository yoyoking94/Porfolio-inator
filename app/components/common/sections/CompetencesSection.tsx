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

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setError(null);
                const [techRes, compRes] = await Promise.all([
                    fetch('/api/competences/techniquesRoute', { method: 'GET' }),
                    fetch('/api/competences/comportementalesRoute', { method: 'GET' }),
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
        return () => {
            cancelled = true;
        };
    }, []);

    const hasAny = useMemo(
        () => (techniques && techniques.length > 0) || (comportementales && comportementales.length > 0),
        [techniques, comportementales]
    );

    return (
        <section className="space-y-4 h-full">
            <h2 className="text-pixel-lg">Compétences</h2>
            {error && <p className="text-pixel-xs text-red-600">Erreur: {error}</p>}
            {(techniques === null || comportementales === null) && <p className="text-pixel-xs">Chargement…</p>}

            {hasAny ? (
                <div className="space-y-4">
                    {techniques && techniques.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-pixel-base font-bold">Techniques</h3>
                            {techniques.map((cat) => (
                                <div key={cat.id} className="border-2 border-black p-2 bg-white">
                                    <h4 className="text-pixel-sm font-bold mb-2">{cat.categorie}</h4>
                                    <div className="h-full">
                                        {(cat.items || []).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-center"
                                                title={item.nom}
                                            >
                                                <TechIcon name={item.nom} className="w-full h-full p-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

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
            ) : (
                <p className="text-pixel-xs">Aucune compétence trouvée.</p>
            )}
        </section>
    );
};

export default CompetencesSection;
