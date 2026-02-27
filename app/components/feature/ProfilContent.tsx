"use client";

import { useEffect, useState } from "react";
import type { Profil, Langue, CentreInteret } from "@/app/types";

// On omet les dates car elles arrivent sous forme de string depuis l'API JSON
type ProfilDTO = Omit<Profil, "created_at" | "updated_at"> & {
    created_at: string;
    updated_at: string;
};

export default function ProfilContent() {
    const [profilData, setProfilData] = useState<ProfilDTO | null>(null);
    const [langueList, setLangueList] = useState<Langue[]>([]);
    const [centreInteretList, setCentreInteretList] = useState<CentreInteret[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // On utilise un flag pour éviter les mises à jour sur un composant démonté
        let isCancelled = false;

        async function loadProfilData() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                // On lance les trois requêtes en parallèle pour aller plus vite
                const [profilResponse, languesResponse, centresInteretResponse] =
                    await Promise.all([
                        fetch("/api/db/profil"),
                        fetch("/api/db/langues"),
                        fetch("/api/db/centreInteret"),
                    ]);

                if (!profilResponse.ok) {
                    throw new Error(`Erreur profil : HTTP ${profilResponse.status}`);
                }
                if (!languesResponse.ok) {
                    throw new Error(`Erreur langues : HTTP ${languesResponse.status}`);
                }
                if (!centresInteretResponse.ok) {
                    throw new Error(
                        `Erreur centres d'intérêt : HTTP ${centresInteretResponse.status}`
                    );
                }

                const profilJson = (await profilResponse.json()) as { profil: ProfilDTO };
                const languesJson = (await languesResponse.json()) as { langues: Langue[] };
                const centresInteretJson = (await centresInteretResponse.json()) as {
                    centresInteret: CentreInteret[];
                };

                if (!isCancelled) {
                    setProfilData(profilJson.profil);
                    setLangueList(languesJson.langues);
                    setCentreInteretList(centresInteretJson.centresInteret);
                }
            } catch (error) {
                if (!isCancelled) {
                    setErrorMessage(
                        error instanceof Error ? error.message : "Erreur inconnue"
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadProfilData();

        return () => {
            isCancelled = true;
        };
    }, []);

    if (isLoading) {
        return <p className="uppercase tracking-widest animate-pulse">Chargement...</p>;
    }

    if (errorMessage) {
        return <p className="uppercase tracking-widest">Erreur : {errorMessage}</p>;
    }

    if (!profilData) {
        return <p className="uppercase tracking-widest">Aucune donnée disponible.</p>;
    }

    return (
        <section className="space-y-6">

            {/* ── Identité ─────────────────────────────────────────── */}
            <article>
                <h2 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                    À propos de moi
                </h2>
                <p>
                    <strong>{profilData.prenom} {profilData.nom}</strong>
                    {profilData.poste_actuel ? ` — ${profilData.poste_actuel}` : ""}
                </p>
                {profilData.localisation && (
                    <p><span className="underline">Localisation</span> : {profilData.localisation}</p>
                )}
                {profilData.recherche && (
                    <p><span className="underline">Recherche</span> : {profilData.recherche}</p>
                )}
                {profilData.bio && (
                    <p><span className="underline">Bio</span> : {profilData.bio}</p>
                )}
            </article>

            {/* ── Valeurs ──────────────────────────────────────────── */}
            {profilData.valeurs && (
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                        Mes valeurs
                    </h3>
                    <p>{profilData.valeurs}</p>
                </article>
            )}

            {/* ── Projet ───────────────────────────────────────────── */}
            {profilData.projet && (
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                        Mon projet
                    </h3>
                    <p>{profilData.projet}</p>
                </article>
            )}

            {/* ── Qualités ─────────────────────────────────────────── */}
            {profilData.qualitees && (
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                        Mes qualités
                    </h3>
                    <p>{profilData.qualitees}</p>
                </article>
            )}

            {/* ── Centre interet ───────────────────────────────────── */}
            {/* {profilData.centre_interet && (
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                        Mes centres d&apos;interet
                    </h3>
                    <p>{profilData.centre_interet}</p>
                </article>
            )} */}

            {/* ── Langues ──────────────────────────────────────────── */}
            {langueList.length > 0 && (
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                        Langues
                    </h3>
                    <ul>
                        {langueList.map((langue) => (
                            <li key={langue.id}>
                                {langue.langue} — {langue.niveau}
                            </li>
                        ))}
                    </ul>
                </article>
            )}

            {/* ── Centres d'intérêt ────────────────────────────────── */}
            {centreInteretList.length > 0 && (
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-3">
                        Centres d&apos;intérêt
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {centreInteretList.map((centreInteret) => (
                            <span
                                key={centreInteret.id}
                                className="bg-black small text-white px-2 py-1"
                            >
                                {centreInteret.nom}
                            </span>
                        ))}
                    </div>
                </article>
            )}

        </section>
    );
}
