"use client";

import { useEffect, useState, useCallback } from "react";
import { useWindowManager } from "@/app/context/WindowManagerContext";
import type { GitHubRepo, CompetenceTechnique, CompetenceComportementale } from "@/app/types";

const TWO_COLUMN_BREAKPOINT_IN_PIXELS = 500;

const FEATURED_REPO_NAMES = [
    "log-inator",
    "fitness-inator",
    "password-inator-2",
    "porfolio-inator",
    "diet-inator",
];

type ProjetsContentProps = {
    competencesTechniques: CompetenceTechnique[];
    competencesComportementales: CompetenceComportementale[];
};

export default function ProjetsContent({
    competencesTechniques,
    competencesComportementales,
}: ProjetsContentProps) {
    const [repoList, setRepoList] = useState<GitHubRepo[]>([]);
    const [activeTab, setActiveTab] = useState<string>("Sélection");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sectionWidth, setSectionWidth] = useState<number>(0);

    const { openDynamicWindow } = useWindowManager();

    const measuredRef = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        setSectionWidth(node.getBoundingClientRect().width);
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setSectionWidth(entry.contentRect.width);
            }
        });
        resizeObserver.observe(node);
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function loadProjetsData() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const response = await fetch("/api/github");
                if (!response.ok) throw new Error(`Erreur projets : HTTP ${response.status}`);

                const repoListJson = (await response.json()) as GitHubRepo[];
                if (!isCancelled) setRepoList(repoListJson);
            } catch (error) {
                if (!isCancelled) {
                    setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        }

        loadProjetsData();
        return () => { isCancelled = true; };
    }, []);

    const isTwoColumnLayout = sectionWidth > TWO_COLUMN_BREAKPOINT_IN_PIXELS;

    const languageList = repoList
        .map((repo) => repo.language)
        .filter((language): language is string => language !== null);

    const uniqueLanguageList = [
        "Sélection",
        "Tous",
        ...Array.from(new Set(languageList)).sort(),
    ];

    const filteredRepoList = (() => {
        if (activeTab === "Sélection") {
            return repoList.filter((repo) =>
                FEATURED_REPO_NAMES.includes(repo.name.toLowerCase())
            );
        }
        if (activeTab === "Tous") return repoList;
        return repoList.filter((repo) => repo.language === activeTab);
    })();

    if (isLoading) {
        return <p className="uppercase tracking-widest animate-pulse">Chargement...</p>;
    }

    if (errorMessage) {
        return <p className="uppercase tracking-widest">Erreur : {errorMessage}</p>;
    }

    return (
        <section ref={measuredRef}>

            {/* ── Onglets ──────────────────────────────────────────── */}
            <div className="flex flex-wrap border-b-2 border-black mb-3">
                {uniqueLanguageList.map((language) => (
                    <button
                        key={language}
                        onClick={() => setActiveTab(language)}
                        className={`
              px-3 py-1 border-r-2 border-b-2 border-black
              cursor-none hoverable uppercase tracking-widest
              ${activeTab === language
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-gray-100"
                            }
            `}
                    >
                        {language}
                    </button>
                ))}
            </div>

            {/* ── Grille des projets ────────────────────────────────── */}
            {filteredRepoList.length === 0 ? (
                <p className="uppercase tracking-widest">Aucun projet pour ce langage.</p>
            ) : (
                <ul
                    className="grid gap-2"
                    style={{
                        gridTemplateColumns: isTwoColumnLayout
                            ? "repeat(2, 1fr)"
                            : "repeat(1, 1fr)",
                    }}
                >
                    {filteredRepoList.map((repo) => (
                        <li key={repo.id} className="flex">
                            <button
                                onClick={() =>
                                    openDynamicWindow({
                                        type: "projet-detail",
                                        data: {
                                            repo,
                                            competencesTechniques,
                                            competencesComportementales,
                                        },
                                    })
                                }
                                className="
                  flex flex-col gap-1
                  w-full text-left
                  border-2 border-black p-2
                  hover:bg-black hover:text-white
                  cursor-none hoverable
                "
                            >
                                {/* ── Indicateur featured ──────────────────────── */}
                                {activeTab !== "Sélection" &&
                                    FEATURED_REPO_NAMES.includes(repo.name.toLowerCase()) && (
                                        <span className="text-xs uppercase tracking-widest opacity-60 border border-current px-1 self-start">
                                            ★ Sélection
                                        </span>
                                    )}

                                {/* ── Nom ──────────────────────────────────────── */}
                                <p className="uppercase tracking-widest break-all leading-relaxed">
                                    {repo.name}
                                </p>

                                {/* ── Description ──────────────────────────────── */}
                                {repo.description && (
                                    <p className="break-words whitespace-normal leading-relaxed opacity-80">
                                        {repo.description}
                                    </p>
                                )}

                                {/* ── Footer : langage + étoiles ───────────────── */}
                                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-current">
                                    {repo.language && (
                                        <span className="border border-current px-1">
                                            {repo.language}
                                        </span>
                                    )}
                                    {repo.stargazers_count > 0 && (
                                        <span>★ {repo.stargazers_count}</span>
                                    )}
                                    {repo.homepage && (
                                        <span className="ml-auto">⬡</span>
                                    )}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

        </section>
    );
}
