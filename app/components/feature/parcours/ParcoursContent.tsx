"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/app/context/WindowManagerContext";
import type { Formation, Experience } from "@/app/types";

type ActiveTab = "Formations" | "Expériences";
const TAB_LIST: ActiveTab[] = ["Formations", "Expériences"];

function formatDate(date: string | Date | null): string {
    if (!date) return "Aujourd'hui";
    const dateObject = new Date(date);
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${month}/${year}`;
}

export default function ParcoursContent() {
    const [formationList, setFormationList] = useState<Formation[]>([]);
    const [experienceList, setExperienceList] = useState<Experience[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>("Formations");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { openDynamicWindow } = useWindowManager();

    useEffect(() => {
        let isCancelled = false;

        async function loadParcoursData() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const [formationsResponse, experiencesResponse] = await Promise.all([
                    fetch("/api/db/formations"),
                    fetch("/api/db/experiences"),
                ]);

                if (!formationsResponse.ok) {
                    throw new Error(`Erreur formations : HTTP ${formationsResponse.status}`);
                }
                if (!experiencesResponse.ok) {
                    throw new Error(`Erreur expériences : HTTP ${experiencesResponse.status}`);
                }

                const formationsJson = (await formationsResponse.json()) as { formations: Formation[] };
                const experiencesJson = (await experiencesResponse.json()) as { experiences: Experience[] };

                if (!isCancelled) {
                    setFormationList(formationsJson.formations);
                    setExperienceList(experiencesJson.experiences);
                }
            } catch (error) {
                if (!isCancelled) {
                    setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        }

        loadParcoursData();
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

            {/* ── Liste des formations ──────────────────────────────── */}
            {activeTab === "Formations" && (
                <ul className="space-y-2">
                    {formationList.length === 0 && (
                        <p className="uppercase tracking-widest">Aucune formation.</p>
                    )}
                    {formationList.map((formation) => (
                        <li key={formation.id} className="max-w-[440px]">
                            <button
                                onClick={() => openDynamicWindow({ type: "parcours-detail", data: { type: "formation", formation, experience: null } })}
                                className="
            w-full text-left border-2 border-black p-2
            hover:bg-black hover:text-white
            cursor-none hoverable
          "
                            >
                                <p className="uppercase tracking-widest">{formation.diplome}</p>
                                <p>{formation.etablissement}{formation.ville ? `, ${formation.ville}` : ""}</p>
                                <p>{formatDate(formation.date_debut)} — {formatDate(formation.date_fin)}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ── Liste des expériences ─────────────────────────────── */}
            {activeTab === "Expériences" && (
                <ul className="space-y-2">
                    {experienceList.length === 0 && (
                        <p className="uppercase tracking-widest">Aucune expérience.</p>
                    )}
                    {experienceList.map((experience) => (
                        <li key={experience.id} className="max-w-[440px]">
                            <button
                                onClick={() => openDynamicWindow({ type: "parcours-detail", data: { type: "experience", formation: null, experience } })}
                                className="
            w-full text-left border-2 border-black p-2
            hover:bg-black hover:text-white
            cursor-none hoverable
          "
                            >
                                <p className="uppercase tracking-widest">{experience.poste}</p>
                                <p>{experience.entreprise}{experience.ville ? `, ${experience.ville}` : ""}</p>
                                <p>{formatDate(experience.date_debut)} — {formatDate(experience.date_fin)}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}


        </section>
    );
}
