import AboutSection from "../components/common/sections/AboutSection";
import CompetencesSection from "../components/common/sections/CompetencesSection";
import ContactSection from "../components/common/sections/ContactSection";
import ParcoursSection from "../components/common/sections/ParcoursSection";
import ProjetsSection from "../components/common/sections/ProjetsSection";

export const windowContentMap: Record<number, React.ComponentType> = {
    1: AboutSection,
    2: ParcoursSection,
    3: CompetencesSection,
    4: ProjetsSection,
    5: ContactSection,
};
