"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/app/context/WindowManagerContext";
import type { CompetenceTechnique, CompetenceComportementale } from "@/app/types";

type ActiveTab = "Techniques" | "Comportementales";
const TAB_LIST: ActiveTab[] = ["Techniques", "Comportementales"];

export default function CompetencesContent() {
    const [competenceTechniqueList, setCompetenceTechniqueList] = useState<CompetenceTechnique[]>([]);
    const [competenceComportementaleList, setCompetenceComportementaleList] = useState<CompetenceComportementale[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>("Techniques");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { openDynamicWindow } = useWindowManager();

    useEffect(() => {
        let isCancelled = false;

        async function loadCompetencesData() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const response = await fetch("/api/db/competences");

                if (!response.ok) {
                    throw new Error(`Erreur compétences : HTTP ${response.status}`);
                }

                const competencesJson = (await response.json()) as {
                    competencesTechniques: CompetenceTechnique[];
                    competencesComportementales: CompetenceComportementale[];
                };

                if (!isCancelled) {
                    setCompetenceTechniqueList(competencesJson.competencesTechniques);
                    setCompetenceComportementaleList(competencesJson.competencesComportementales);
                }
            } catch (error) {
                if (!isCancelled) {
                    setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        }

        loadCompetencesData();
        return () => { isCancelled = true; };
    }, []);

    if (isLoading) {
        return <p className="uppercase tracking-widest animate-pulse">Chargement...</p>;
    }

    if (errorMessage) {
        return <p className="uppercase tracking-widest">Erreur : {errorMessage}</p>;
    }

    return (
        <section>

            {/* ── Onglets ──────────────────────────────────────────── */}
            <div className="flex border-b-2 border-black mb-3">
                {TAB_LIST.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              px-3 py-1 border-r-2 border-black
              cursor-none hoverable uppercase tracking-widest
              ${activeTab === tab
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-gray-100"
                            }
            `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Liste des compétences techniques (cliquables) ────── */}
            {activeTab === "Techniques" && (
                <ul className="space-y-2">
                    {competenceTechniqueList.length === 0 && (
                        <p className="uppercase tracking-widest">Aucune compétence technique.</p>
                    )}
                    {competenceTechniqueList.flatMap((competenceTechnique) =>
                        (competenceTechnique.items ?? []).map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() =>
                                        openDynamicWindow({
                                            type: "competence-detail",
                                            data: {
                                                type: "technique",
                                                competenceTechnique,
                                                competenceTechniqueItem: item,
                                                competenceComportementale: null,
                                            },
                                        })
                                    }
                                    className="
              w-full text-left border-2 border-black p-2
              hover:bg-black hover:text-white
              cursor-none hoverable uppercase tracking-widest
            "
                                >
                                    {item.nom}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}


            {/* ── Liste des compétences comportementales ───────────── */}
            {activeTab === "Comportementales" && (
                <ul className="space-y-2">
                    {competenceComportementaleList.length === 0 && (
                        <p className="uppercase tracking-widest">Aucune compétence comportementale.</p>
                    )}
                    {competenceComportementaleList.map((competenceComportementale) => (
                        <li key={competenceComportementale.id}>
                            <button
                                onClick={() =>
                                    openDynamicWindow({
                                        type: "competence-detail",
                                        data: {
                                            type: "comportementale",
                                            competenceTechnique: null,
                                            competenceTechniqueItem: null,
                                            competenceComportementale,
                                        },
                                    })
                                }

                                className="
            w-full text-left border-2 border-black p-2
            hover:bg-black hover:text-white
            cursor-none hoverable uppercase tracking-widest
          "
                            >
                                {competenceComportementale.nom}
                            </button>
                        </li>
                    ))}
                </ul>
            )}


        </section>
    );
}
