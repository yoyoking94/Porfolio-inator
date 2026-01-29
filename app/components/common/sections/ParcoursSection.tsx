// app/components/common/sections/ParcoursSection.tsx
'use client';

import { useEffect, useState } from 'react';
import type { Experience, Formation, TacheExperience } from '@/app/types/database';

type FormationDTO = Omit<Formation, 'date_debut' | 'date_fin'> & {
  date_debut: string;
  date_fin: string | null;
};

type TacheExperienceDTO = TacheExperience;

type ExperienceDTO = Omit<Experience, 'date_debut' | 'date_fin' | 'taches'> & {
  date_debut: string;
  date_fin: string | null;
  taches?: TacheExperienceDTO[];
};

export default function ParcoursSection() {
  const [formations, setFormations] = useState<FormationDTO[] | null>(null);
  const [experiences, setExperiences] = useState<ExperienceDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const [formationsRes, experiencesRes] = await Promise.all([
          fetch('/api/formationsRoute', { method: 'GET' }),
          fetch('/api/experiencesRoute', { method: 'GET' }),
        ]);
        if (!formationsRes.ok) throw new Error(`Formations HTTP ${formationsRes.status}`);
        if (!experiencesRes.ok) throw new Error(`Expériences HTTP ${experiencesRes.status}`);

        const formationsData = (await formationsRes.json()) as { formations: FormationDTO[] };
        const experiencesData = (await experiencesRes.json()) as { experiences: ExperienceDTO[] };

        if (!cancelled) {
          setFormations(formationsData.formations);
          setExperiences(experiencesData.experiences);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Erreur inconnue');
          setFormations([]);
          setExperiences([]);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-pixel-lg">Parcours</h2>

      {(formations === null || experiences === null) && <p className="text-pixel-xs">Chargement…</p>}
      {error && <p className="text-pixel-xs">Erreur: {error}</p>}

      {experiences && experiences.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-pixel-sm font-bold">Expériences</h3>
          {experiences.map((exp) => (
            <div key={exp.id} className="border-2 border-black p-3">
              <h4 className="text-pixel-sm font-bold">{exp.poste}</h4>
              <p className="text-pixel-xs">
                {exp.entreprise}
                {exp.ville ? ` - ${exp.ville}` : ''}
              </p>
              <p className="text-pixel-xs">
                {new Date(exp.date_debut).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                {' - '}
                {exp.date_fin
                  ? new Date(exp.date_fin).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                  : "Aujourd'hui"}
              </p>
              {exp.mission && <p className="text-pixel-xs mt-2">{exp.mission}</p>}
              {exp.taches && exp.taches.length > 0 && (
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {exp.taches.map((t) => (
                    <li key={t.id} className="text-pixel-xs">
                      {t.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {formations && (
        <div className="space-y-3">
          <h3 className="text-pixel-sm font-bold">Formations</h3>
          {formations.map((formation) => (
            <div key={formation.id} className="border-2 border-black p-3">
              <h3 className="text-pixel-sm font-bold">{formation.diplome}</h3>
              <p className="text-pixel-xs">
                {formation.etablissement} - {formation.ville}
              </p>
              <p className="text-pixel-xs">
                {new Date(formation.date_debut).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
                {' - '}
                {formation.date_fin
                  ? new Date(formation.date_fin).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : "Aujourd'hui"}
              </p>
              {formation.technologies && (
                <p className="text-pixel-xs mt-2">
                  <strong>Technologies :</strong> {formation.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
