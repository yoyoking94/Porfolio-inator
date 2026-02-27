"use client";

import { useWindowManager } from "@/app/context/WindowManagerContext";
import type { CompetenceDetailData, GitHubRepo, ProjetsDetailData } from "@/app/types";

type CompetenceDetailContentProps = {
    data: CompetenceDetailData;
};

function NiveauBar({ niveau }: { niveau: number }) {
    const MAXIMUM_NIVEAU = 5;
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: MAXIMUM_NIVEAU }, (_, index) => (
                <span
                    key={index}
                    className={`
            w-3 h-3 border-2 border-black
            ${index < niveau ? "bg-black" : "bg-white"}
          `}
                />
            ))}
        </div>
    );
}

const TECH_TO_PROJECT: Record<string, string> = {
    "javascript": "Finance-inator",
    "typescript": "Fitness-inator",
    "python": "Password-inator-2",
    "sql": "Porfolio-inator",
    "nosql": "Diet-inator",
};

const BEHAVIOR_TO_PROJECT: Record<string, string> = {
    "planification": "Finance-inator",
    "autonomie": "Fitness-inator",
    "discipline": "Password-inator-2",
    "adaptabilité": "Porfolio-inator",
    "résilience": "Diet-inator",
    "priorisation": "Finance-inator",
    "gestion du temps": "Fitness-inator",
};

export default function CompetenceDetailContent({ data }: CompetenceDetailContentProps) {
    const { openDynamicWindow } = useWindowManager();

    const projectName =
        data.type === "technique"
            ? TECH_TO_PROJECT[data.competenceTechniqueItem?.nom?.toLowerCase() ?? ""] ?? null
            : BEHAVIOR_TO_PROJECT[data.competenceComportementale?.nom?.toLowerCase() ?? ""] ?? null;

    async function handleOpenProjet() {
        if (!projectName) return;
        try {
            const response = await fetch("/api/github");
            const repos = (await response.json()) as GitHubRepo[];
            const repo = repos.find(
                (r) => r.name.toLowerCase() === projectName.toLowerCase()
            );
            if (repo) {
                // On ouvre sans compétences liées (pas nécessaire depuis cette direction)
                const projetData: ProjetsDetailData = {
                    repo,
                    competencesTechniques: [],
                    competencesComportementales: [],
                };
                openDynamicWindow({ type: "projet-detail", data: projetData });
            }
        } catch (error) {
            console.error("Erreur chargement projet :", error);
        }
    }

    // ── Détail item technique ─────────────────────────────────
    if (data.type === "technique" && data.competenceTechniqueItem) {
        return (
            <section className="space-y-4">
                <h3 className="uppercase tracking-widest border-b border-black pb-1">
                    {data.competenceTechniqueItem.nom}
                </h3>

                {data.competenceTechnique && (
                    <article>
                        <h4>
                            <span className="underline">Catégorie</span> : {data.competenceTechnique.categorie}
                        </h4>
                    </article>
                )}

                <article className="space-y-1 flex item-end">
                    <h4 className="underline">Niveau : </h4>
                    <NiveauBar niveau={data.competenceTechniqueItem.niveau} />
                </article>

                <article>
                    <h4 className="underline">Ma définition :</h4>
                    <p>{data.competenceTechniqueItem.definition}</p>
                </article>

                <article>
                    <h4 className="underline">Mes éléments de preuves :</h4>
                    <p>{data.competenceTechniqueItem.preuves}</p>
                </article>

                <article>
                    <h4 className="underline">Mon autocritique :</h4>
                    <p>{data.competenceTechniqueItem.autocritique}</p>
                </article>

                <article>
                    <h4 className="underline">Mon évolution dans cette compétence :</h4>
                    <p>{data.competenceTechniqueItem.evolution}</p>
                </article>

                <article className="border-t-2 border-black pt-3">
                    <h4 className="underline mb-2">Lien vers mon projet :</h4>
                    {projectName ? (
                        <button
                            onClick={handleOpenProjet}
                            className="
                border-2 border-black px-3 py-1
                uppercase tracking-widest text-sm
                hover:bg-black hover:text-white
                cursor-none hoverable
              "
                        >
                            {projectName}
                        </button>
                    ) : (
                        <p className="opacity-60 uppercase tracking-widest text-sm">
                            Aucun projet associé
                        </p>
                    )}
                </article>
            </section>
        );
    }

    // ── Détail comportementale ────────────────────────────────
    if (data.type === "comportementale" && data.competenceComportementale) {
        return (
            <section className="space-y-3">
                <h3 className="uppercase tracking-widest border-b border-black pb-1">
                    {data.competenceComportementale.nom}
                </h3>

                <article>
                    <h4 className="underline">Ma définition :</h4>
                    <p>{data.competenceComportementale.definition}</p>
                </article>

                <article>
                    <h4 className="underline">Mes éléments de preuves :</h4>
                    <p>{data.competenceComportementale.preuves}</p>
                </article>

                <article>
                    <h4 className="underline">Mon autocritique :</h4>
                    <p>{data.competenceComportementale.autocritique}</p>
                </article>

                <article>
                    <h4 className="underline">Mon évolution dans cette compétence :</h4>
                    <p>{data.competenceComportementale.evolution}</p>
                </article>

                <article className="border-t-2 border-black pt-3">
                    <h4 className="underline mb-2">Lien vers mon projet :</h4>
                    {projectName ? (
                        <button
                            onClick={handleOpenProjet}
                            className="
                border-2 border-black px-3 py-1
                uppercase tracking-widest text-sm
                hover:bg-black hover:text-white
                cursor-none hoverable
              "
                        >
                            {projectName}
                        </button>
                    ) : (
                        <p className="opacity-60 uppercase tracking-widest text-sm">
                            Aucun projet associé
                        </p>
                    )}
                </article>
            </section>
        );
    }

    return null;
}
