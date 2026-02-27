import { getCompetencesTechniques, getCompetencesComportementales } from "@/app/lib/database";
import { NextResponse } from "next/server";
import type { CompetenceTechnique } from "@/app/types";

const ITEMS_AFFICHES = ["javascript", "typescript", "python", "sql", "nosql"];

export async function GET() {
    try {
        const [competencesTechniques, competencesComportementales] = await Promise.all([
            getCompetencesTechniques(),
            getCompetencesComportementales(),
        ]);

        // On filtre les items pour n'afficher que ceux dans ITEMS_AFFICHES
        const competencesTechniquesFiltrees = competencesTechniques.map(
            (categorie: CompetenceTechnique) => ({
                ...categorie,
                items: (categorie.items ?? []).filter((item) =>
                    ITEMS_AFFICHES.includes(item.nom.toLowerCase())
                ),
            })
        );

        return NextResponse.json({
            competencesTechniques: competencesTechniquesFiltrees,
            competencesComportementales,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Erreur lors de la récupération des compétences" },
            { status: 500 }
        );
    }
}

export const revalidate = 3600;
