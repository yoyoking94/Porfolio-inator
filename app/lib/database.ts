import 'server-only';
import { neon } from '@neondatabase/serverless';
import type {
  Profil,
  Formation,
  Experience,
  CompetenceTechnique,
  CompetenceComportementale,
  Langue,
  CentreInteret
} from '../types';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL manquant dans .env.local');
}

export const sql = neon(process.env.DATABASE_URL);

// ==========================================
// PROFIL
// ==========================================
export async function getProfile(): Promise<Profil> {
  const result = await sql`SELECT * FROM profil WHERE id = 1`;
  return result[0] as Profil;
}

// ==========================================
// FORMATIONS
// ==========================================
export async function getFormations(): Promise<Formation[]> {
  return await sql`
      SELECT id, profil_id, etablissement, description_etablissement, ville, diplome, date_debut, date_fin,
             description, technologies, cours, ordre
      FROM formations
      WHERE profil_id = 1
      ORDER BY ordre ASC
  ` as Formation[];
}

// ==========================================
// EXPÉRIENCES
// ==========================================
export async function getExperiences(): Promise<Experience[]> {
  const result = await sql`
    SELECT 
      e.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', t.id,
            'experience_id', t.experience_id,
            'description', t.description,
            'ordre', t.ordre
          ) ORDER BY t.ordre
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) as taches
    FROM experiences e
    LEFT JOIN taches_experience t ON t.experience_id = e.id
    WHERE e.profil_id = 1
    GROUP BY e.id
    ORDER BY e.ordre ASC
  `;
  return result as Experience[];
}

// ==========================================
// COMPÉTENCES TECHNIQUES
// ==========================================
export async function getCompetencesTechniques(): Promise<CompetenceTechnique[]> {
  const result = await sql`
    SELECT 
      ct.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', cti.id,
            'competence_id', cti.competence_id,
            'nom', cti.nom,
            'niveau', cti.niveau,
            'ordre', cti.ordre,
            'definition', cti.definition,
            'preuves', cti.preuves,
            'autocritique', cti.autocritique,
            'evolution', cti.evolution
          ) ORDER BY cti.ordre
        ) FILTER (WHERE cti.id IS NOT NULL),
        '[]'
      ) as items
    FROM competences_techniques ct
    LEFT JOIN competences_techniques_items cti ON cti.competence_id = ct.id
    WHERE ct.profil_id = 1
    GROUP BY ct.id
    ORDER BY ct.ordre ASC
  `;
  return result as CompetenceTechnique[];
}

// ==========================================
// COMPÉTENCES COMPORTEMENTALES
// ==========================================
export async function getCompetencesComportementales(): Promise<CompetenceComportementale[]> {
  return await sql`
    SELECT * FROM competences_comportementales
    WHERE profil_id = 1
    ORDER BY ordre ASC
  ` as CompetenceComportementale[];
}

// ==========================================
// LANGUES
// ==========================================
export async function getLangues(): Promise<Langue[]> {
  return await sql`
    SELECT * FROM langues
    WHERE profil_id = 1
    ORDER BY ordre ASC
  ` as Langue[];
}

// ==========================================
// CENTRES D'INTÉRÊT
// ==========================================
export async function getCentresInteret(): Promise<CentreInteret[]> {
  return await sql`
    SELECT * FROM centres_interet
    WHERE profil_id = 1
    ORDER BY ordre ASC
  ` as CentreInteret[];
}

// ==========================================
// FONCTION GLOBALE (récupère tout)
// ==========================================
export async function getAllPortfolioData() {
  const [
    profil,
    formations,
    experiences,
    competences_techniques,
    competences_comportementales,
    langues,
    centres_interet
  ] = await Promise.all([
    getProfile(),
    getFormations(),
    getExperiences(),
    getCompetencesTechniques(),
    getCompetencesComportementales(),
    getLangues(),
    getCentresInteret()
  ]);

  return {
    profil,
    formations,
    experiences,
    competences_techniques,
    competences_comportementales,
    langues,
    centres_interet
  };
}
