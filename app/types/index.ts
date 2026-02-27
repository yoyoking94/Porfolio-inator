import { StaticImageData } from "next/image";

export interface Profil {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    website: string;
    localisation: string;
    poste_actuel: string;
    recherche: string;
    permis: string;
    bio: string;
    valeurs: string;
    projet: string;
    qualitees: string;
    centre_interet: string;
    created_at: Date;
    updated_at: Date;
}

export interface Formation {
    id: number;
    profil_id: number;
    etablissement: string;
    description_etablissement: string;
    ville: string | null;
    diplome: string;
    date_debut: Date;
    date_fin: Date | null;
    description: string | null;
    technologies: string | null;
    ordre: number;
    cours: string;
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
    definition: string;
    preuves: string;
    autocritique: string;
    evolution: string;
}

export interface CompetenceComportementale {
    id: number;
    profil_id: number;
    nom: string;
    ordre: number;
    definition: string;
    preuves: string;
    autocritique: string;
    evolution: string;
}

export type CompetenceDetailData = {
    type: "technique" | "comportementale";
    competenceTechnique: CompetenceTechnique | null;
    competenceComportementale: CompetenceComportementale | null;
    competenceTechniqueItem: CompetenceTechniqueItem | null;
};


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

export type WindowPosition = {
    x: number;
    y: number;
};

export type WindowSize = {
    width: number;
    height: number;
};

export type DragWindowProps = {
    windowId: string;
    windowTitle: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    containerRef: React.RefObject<HTMLElement | null>;
    defaultPosition?: WindowPosition;
    defaultSize?: WindowSize;
    maxSize?: WindowSize; // ← AJOUTÉ : taille maximale optionnelle
};

export type WindowConfig = {
    windowId: string;
    windowTitle: string;
    windowIcon: StaticImageData;
    defaultPosition: WindowPosition;
    defaultSize: WindowSize;
    maxSize?: WindowSize; // ← AJOUTÉ : taille maximale optionnelle
};

// Données d'un détail de parcours passées entre fenêtres
export type ParcoursDetailData = {
    type: "formation" | "experience";
    formation: Formation | null;
    experience: Experience | null;
};


export type GitHubRepo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    topics: string[];
    language: string | null;
    stargazers_count: number;
    homepage: string | null;
    fork: boolean;
    readme: ReadmeContent | null; // ← AJOUTÉ
};

export type ReadmeContent = {
    presentation: string | null;
    objectifs: string | null;
    etapes: string | null;
    acteurs: string | null;
    resultats: string | null;
    lendemains: string | null;
    regard_critique: string | null;
};


export type ProjetsDetailData = {
    repo: GitHubRepo;
    competencesTechniques: CompetenceTechnique[];
    competencesComportementales: CompetenceComportementale[];
  };