// types/database.ts
export interface Profil {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    website: string | null;
    localisation: string | null;
    poste_actuel: string | null;
    recherche: string | null;
    permis: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Formation {
    id: number;
    profil_id: number;
    etablissement: string;
    ville: string | null;
    diplome: string;
    date_debut: Date;
    date_fin: Date | null;
    description: string | null;
    technologies: string | null;
    ordre: number;
}

export interface Experience {
    id: number;
    profil_id: number;
    entreprise: string;
    ville: string | null;
    poste: string;
    date_debut: Date;
    date_fin: Date | null;
    ca: string | null;
    mission: string | null;
    ordre: number;
    taches?: TacheExperience[];
}

export interface TacheExperience {
    id: number;
    experience_id: number;
    description: string;
    ordre: number;
}

export interface CompetenceTechnique {
    id: number;
    profil_id: number;
    categorie: string;
    ordre: number;
    items?: CompetenceTechniqueItem[];
}

export interface CompetenceTechniqueItem {
    id: number;
    competence_id: number;
    nom: string;
    niveau: number;
    ordre: number;
}

export interface CompetenceComportementale {
    id: number;
    profil_id: number;
    nom: string;
    ordre: number;
}

export interface Langue {
    id: number;
    profil_id: number;
    langue: string;
    niveau: string;
    ordre: number;
}

export interface CentreInteret {
    id: number;
    profil_id: number;
    nom: string;
    ordre: number;
}
