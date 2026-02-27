import type { ParcoursDetailData } from "@/app/types";

function formatDate(date: string | Date | null): string {
    if (!date) return "Aujourd'hui";
    const dateObject = new Date(date);
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${month}/${year}`;
}

type ParcoursDetailContentProps = {
    data: ParcoursDetailData;
};

export default function ParcoursDetailContent({ data }: ParcoursDetailContentProps) {

    // ── Détail d'une formation ──────────────────────────────
    if (data.type === "formation" && data.formation) {
        const formation = data.formation;
        return (
            <section className="space-y-3">
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-2">
                        {formation.diplome}
                    </h3>
                    <p><span className="underline">Établissement</span> : {formation.etablissement}</p>
                    <p><span className="underline">Description de l&apos;établissement</span> : {formation.description_etablissement}</p>
                    {formation.ville && (
                        <p><span className="underline">Ville</span> : {formation.ville}</p>
                    )}
                    <p>
                        <span className="underline">Période</span> :{" "}
                        {formatDate(formation.date_debut)} — {formatDate(formation.date_fin)}
                    </p>
                    {formation.description && (
                        <p><span className="underline">Thématique</span> : {formation.description}</p>
                    )}
                    {formation.technologies && (
                        <p><span className="underline">Technologies</span> : {formation.technologies}</p>
                    )}
                    {formation.cours && (
                        <p><span className="underline">Cours</span> : {formation.cours}</p>
                    )}
                </article>
            </section>
        );
    }

    // ── Détail d'une expérience ─────────────────────────────
    if (data.type === "experience" && data.experience) {
        const experience = data.experience;
        return (
            <section className="space-y-3">
                <article>
                    <h3 className="uppercase tracking-widest border-b border-black pb-1 mb-2">
                        {experience.poste}
                    </h3>
                    <p><span className="underline">Entreprise</span> : {experience.entreprise}</p>
                    {experience.ville && (
                        <p><span className="underline">Ville</span> : {experience.ville}</p>
                    )}
                    <p>
                        <span className="underline">Période</span> :{" "}
                        {formatDate(experience.date_debut)} — {formatDate(experience.date_fin)}
                    </p>
                    {experience.ca && (
                        <p><span className="underline">CA</span> : {experience.ca}</p>
                    )}
                    {experience.mission && (
                        <p><span className="underline">Mission</span> : {experience.mission}</p>
                    )}

                    {/* ── Tâches ───────────────────────────────────── */}
                    {experience.taches && experience.taches.length > 0 && (
                        <div className="mt-2">
                            <p className="underline mb-1">Tâches :</p>
                            <ul className="list-disc pl-4 space-y-1">
                                {experience.taches.map((tache) => (
                                    <li key={tache.id}>{tache.description}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </article>
            </section>
        );
    }

    return null;
}
