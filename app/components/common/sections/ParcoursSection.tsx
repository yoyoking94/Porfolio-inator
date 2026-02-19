'use client';

import { useEffect, useState } from 'react';
import type { Experience, Formation, TacheExperience } from '@/app/types/database';
import ParcoursCard from './parcours/ParcoursCard';
import ParcoursDetailWindow from './parcours/ParcoursDetailsWindow';
import { useParcoursWindows } from '@/app/hooks/useParcoursWindows';

type FormationDTO = Omit<Formation, 'date_debut' | 'date_fin'> & {
  date_debut: string;
  date_fin: string | null;
  cours: string | null;
};

type TacheExperienceDTO = TacheExperience;

type ExperienceDTO = Omit<Experience, 'date_debut' | 'date_fin' | 'taches'> & {
  date_debut: string;
  date_fin: string | null;
  taches?: TacheExperienceDTO[];
};

const TABS = ['Expériences', 'Formations'] as const;
type Tab = typeof TABS[number];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

export default function ParcoursSection() {
  const [formations, setFormations] = useState<FormationDTO[] | null>(null);
  const [experiences, setExperiences] = useState<ExperienceDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Expériences');

  const exps = useParcoursWindows<ExperienceDTO>();
  const forms = useParcoursWindows<FormationDTO>();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const [formationsRes, experiencesRes] = await Promise.all([
          fetch('/api/formationsRoute'),
          fetch('/api/experiencesRoute'),
        ]);
        if (!formationsRes.ok) throw new Error(`Formations HTTP ${formationsRes.status}`);
        if (!experiencesRes.ok) throw new Error(`Expériences HTTP ${experiencesRes.status}`);

        const { formations: f } = await formationsRes.json();
        const { experiences: e } = await experiencesRes.json();

        if (!cancelled) { setFormations(f); setExperiences(e); }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
          setFormations([]);
          setExperiences([]);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="space-y-4 h-full">
      <h2 className="text-pixel-lg">Parcours</h2>

      {(formations === null || experiences === null) && <p className="text-pixel-xs">Chargement…</p>}
      {error && <p className="text-pixel-xs text-red-500">Erreur : {error}</p>}

      {formations !== null && experiences !== null && (
        <div>
          {/* ── Onglets ── */}
          <div className="flex border-b-2 border-black mb-3">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-pixel-xs border-r-2 border-black transition-colors cursor-none hoverable
                  ${activeTab === tab
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Contenu onglet Expériences ── */}
          {activeTab === 'Expériences' && (
            <div className="space-y-3">
              {experiences.length === 0 && <p className="text-pixel-xs">Aucune expérience.</p>}
              {experiences.map((exp) => (
                <ParcoursCard
                  key={exp.id}
                  title={exp.poste}
                  subtitle={`${exp.entreprise}${exp.ville ? ` - ${exp.ville}` : ''}`}
                  dates={`${formatDate(exp.date_debut)} - ${exp.date_fin ? formatDate(exp.date_fin) : "Aujourd'hui"}`}
                  extra={exp.mission ?? undefined}
                  onClick={() => exps.open(exp)}
                />
              ))}
            </div>
          )}

          {/* ── Contenu onglet Formations ── */}
          {activeTab === 'Formations' && (
            <div className="space-y-3">
              {formations.length === 0 && <p className="text-pixel-xs">Aucune formation.</p>}
              {formations.map((formation) => (
                <ParcoursCard
                  key={formation.id}
                  title={formation.diplome}
                  subtitle={`${formation.etablissement} - ${formation.ville}`}
                  dates={`${formatDate(formation.date_debut)} - ${formation.date_fin ? formatDate(formation.date_fin) : "Aujourd'hui"}`}
                  extra={formation.technologies ? `Technologies : ${formation.technologies}` : undefined}
                  onClick={() => forms.open(formation)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DragWindows expériences ── */}
      {exps.opened.map((exp, index) => (
        <ParcoursDetailWindow
          key={exp.id}
          title={`${exp.poste} — ${exp.entreprise}`}
          index={index}
          onClose={() => exps.close(exp.id)}
        >
          {exp.mission && <p className="text-pixel-xs italic mb-2">{exp.mission}</p>}
          {exp.taches && exp.taches.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {exp.taches.map((t) => (
                <li key={t.id} className="text-pixel-xs">{t.description}</li>
              ))}
            </ul>
          )}
        </ParcoursDetailWindow>
      ))}

      {/* ── DragWindows formations ── */}
      {forms.opened.map((formation, index) => (
        <ParcoursDetailWindow
          key={formation.id}
          title={`${formation.diplome} — ${formation.etablissement}`}
          index={index}
          onClose={() => forms.close(formation.id)}
        >
          {formation.cours && (
            <div>
              <p className="text-pixel-xs font-bold mb-1">Cours suivis :</p>
              <ul className="list-disc pl-5 space-y-1">
                {formation.cours.split(',').map((cours, i) => (
                  <li key={i} className="text-pixel-xs">{cours.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </ParcoursDetailWindow>
      ))}

    </section>
  );
}
