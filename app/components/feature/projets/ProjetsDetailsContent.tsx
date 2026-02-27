"use client";

import { useWindowManager } from "@/app/context/WindowManagerContext";
import type {
    GitHubRepo,
    ProjetsDetailData,
    CompetenceTechnique,
    CompetenceComportementale,
} from "@/app/types";

type ProjetsDetailContentProps = {
    data: ProjetsDetailData;
};

type ReadmeSection = {
    label: string;
    key: keyof NonNullable<GitHubRepo["readme"]>;
};

const README_SECTIONS: ReadmeSection[] = [
    { label: "Présentation", key: "presentation" },
    { label: "Objectifs, contexte, enjeux et risques", key: "objectifs" },
    { label: "Étapes", key: "etapes" },
    { label: "Acteurs et interactions", key: "acteurs" },
    { label: "Résultats", key: "resultats" },
    { label: "Lendemains du projet", key: "lendemains" },
    { label: "Mon regard critique", key: "regard_critique" },
];

const PROJECT_TO_COMPETENCES: Record<string, { techniques: string[]; comportementales: string[] }> = {
    "finance-inator": {
        techniques: ["JavaScript"],
        comportementales: ["Planification", "Priorisation"],
    },
    "fitness-inator": {
        techniques: ["TypeScript"],
        comportementales: ["Autonomie", "Gestion du temps"],
    },
    "password-inator-2": {
        techniques: ["Python"],
        comportementales: ["Discipline"],
    },
    "porfolio-inator": {
        techniques: ["SQL"],
        comportementales: ["Adaptabilité"],
    },
    "diet-inator": {
        techniques: ["NoSQL"],
        comportementales: ["Résilience"],
    },
};

export default function ProjetsDetailContent({ data }: ProjetsDetailContentProps) {
    const { repo } = data;
    const { openDynamicWindow } = useWindowManager();

    const competencesLiees = PROJECT_TO_COMPETENCES[repo.name.toLowerCase()] ?? null;

    async function handleOpenTechnique(nomCompetence: string) {
        try {
            const response = await fetch("/api/db/competences");
            const apiData = await response.json();
            const techniques: CompetenceTechnique[] = apiData.competencesTechniques ?? [];

            for (const categorie of techniques) {
                const item = categorie.items?.find(
                    (i) => i.nom.toLowerCase() === nomCompetence.toLowerCase()
                );
                if (item) {
                    openDynamicWindow({
                        type: "competence-detail",
                        data: {
                            type: "technique",
                            competenceTechnique: categorie,
                            competenceTechniqueItem: item,
                            competenceComportementale: null,
                        },
                    });
                    return;
                }
            }
        } catch (error) {
            console.error("Erreur fetch compétences :", error);
        }
    }

    async function handleOpenComportementale(nomCompetence: string) {
        try {
            const response = await fetch("/api/db/competences");
            const apiData = await response.json();
            const comportementales: CompetenceComportementale[] = apiData.competencesComportementales ?? [];

            const comportementale = comportementales.find(
                (c) => c.nom.toLowerCase() === nomCompetence.toLowerCase()
            );
            if (comportementale) {
                openDynamicWindow({
                    type: "competence-detail",
                    data: {
                        type: "comportementale",
                        competenceTechnique: null,
                        competenceTechniqueItem: null,
                        competenceComportementale: comportementale,
                    },
                });
            }
        } catch (error) {
            console.error("Erreur fetch compétences :", error);
        }
    }

    return (
        <div className="flex flex-col gap-4">

            {/* ── En-tête ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-1 border-b-2 border-black pb-3">
                {repo.description && (
                    <p className="leading-relaxed">{repo.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                    {repo.language && (
                        <span className="border border-black px-2 py-0.5 uppercase tracking-widest text-sm">
                            {repo.language}
                        </span>
                    )}
                    {repo.stargazers_count > 0 && (
                        <span>★ {repo.stargazers_count}</span>
                    )}
                </div>
            </div>

            {/* ── Sections README ────────────────────────────────── */}
            {repo.readme ? (
                README_SECTIONS.map((section) => {
                    const content = repo.readme![section.key];
                    if (!content) return null;
                    return (
                        <div key={section.key} className="flex flex-col gap-1">
                            <p className="uppercase tracking-widest font-bold border-b border-black pb-1">
                                {section.label}
                            </p>
                            <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
                        </div>
                    );
                })
            ) : (
                <p className="opacity-60 uppercase tracking-widest">
                    Aucune documentation disponible.
                </p>
            )}

            {/* ── Compétences liées ──────────────────────────────── */}
            {competencesLiees && (
                <div className="flex flex-col gap-3 border-t-2 border-black pt-3">
                    <p className="uppercase tracking-widest font-bold">Compétences liées</p>

                    {competencesLiees.techniques.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <p className="uppercase tracking-widest text-sm opacity-60">Techniques</p>
                            <div className="flex flex-wrap gap-2">
                                {competencesLiees.techniques.map((nom) => (
                                    <button
                                        key={nom}
                                        onClick={() => handleOpenTechnique(nom)}
                                        className="
                      border-2 border-black px-3 py-1
                      uppercase tracking-widest text-sm
                      hover:bg-black hover:text-white
                      cursor-none hoverable
                    "
                                    >
                                        {nom}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {competencesLiees.comportementales.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <p className="uppercase tracking-widest text-sm opacity-60">Comportementales</p>
                            <div className="flex flex-wrap gap-2">
                                {competencesLiees.comportementales.map((nom) => (
                                    <button
                                        key={nom}
                                        onClick={() => handleOpenComportementale(nom)}
                                        className="
                      border-2 border-black px-3 py-1
                      uppercase tracking-widest text-sm
                      hover:bg-black hover:text-white
                      cursor-none hoverable
                    "
                                    >
                                        {nom}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Lien GitHub ────────────────────────────────────── */}
            <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
          mt-auto border-2 border-black p-2
          uppercase tracking-widest text-center
          hover:bg-black hover:text-white
          cursor-none hoverable
        "
            >
                Voir sur GitHub
            </a>

        </div>
    );
}
