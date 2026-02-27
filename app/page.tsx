"use client";

import { useState, useEffect } from "react";
import DragWindow from "@/app/components/common/DragWindow";
import ProfilContent from "@/app/components/feature/ProfilContent";
import ContactContent from "@/app/components/feature/ContactContent";
import CustomCursor from "./components/common/CustomCursor";
import { windowConfigList } from "./config/window.config";
import Nav from "./components/layout/Nav";
import { useWindowManager } from "./context/WindowManagerContext";
import CompetencesContent from "./components/feature/competences/CompetencesContent";
import CompetenceDetailContent from "./components/feature/competences/CompetencesDetailsContent";
import ParcoursContent from "./components/feature/parcours/ParcoursContent";
import ParcoursDetailContent from "./components/feature/parcours/ParcoursDetailsContent";
import ProjetsContent from "./components/feature/projets/ProjetsContent";
import ProjetDetailContent from "./components/feature/projets/ProjetsDetailsContent";
import type {
  CompetenceDetailData,
  CompetenceTechnique,
  CompetenceComportementale,
  ProjetsDetailData,
} from "./types";

// Génère le titre de la fenêtre dynamique selon son type
function getDynamicWindowTitle(windowData: { type: string; data: unknown }): string {
  if (windowData.type === "parcours-detail") {
    const parcoursData = windowData.data as {
      type: string;
      formation: { diplome: string } | null;
      experience: { poste: string } | null;
    };
    if (parcoursData.type === "formation") return parcoursData.formation?.diplome ?? "Formation";
    return parcoursData.experience?.poste ?? "Expérience";
  }
  if (windowData.type === "competence-detail") {
    const competenceData = windowData.data as CompetenceDetailData;
    if (competenceData.type === "technique") {
      return competenceData.competenceTechniqueItem?.nom ?? "Compétence";
    }
    return competenceData.competenceComportementale?.nom ?? "Compétence";
  }
  if (windowData.type === "projet-detail") {
    const projetData = windowData.data as ProjetsDetailData;
    return projetData.repo.name;
  }
  return "Détail";
}

// Génère le contenu de la fenêtre dynamique selon son type
function getDynamicWindowContent(windowData: { type: string; data: unknown }): React.ReactNode {
  if (windowData.type === "parcours-detail") {
    return (
      <ParcoursDetailContent
        data={windowData.data as Parameters<typeof ParcoursDetailContent>[0]["data"]}
      />
    );
  }
  if (windowData.type === "competence-detail") {
    return (
      <CompetenceDetailContent
        data={windowData.data as Parameters<typeof CompetenceDetailContent>[0]["data"]}
      />
    );
  }
  if (windowData.type === "projet-detail") {
    return (
      <ProjetDetailContent
        data={windowData.data as ProjetsDetailData}
      />
    );
  }
  return null;
}

export default function HomePage() {
  const { dynamicWindowList, closeDynamicWindow, containerRef } = useWindowManager();

  const [openWindowMap, setOpenWindowMap] = useState<Record<string, boolean>>(
    Object.fromEntries(
      windowConfigList.map((windowConfig) => [windowConfig.windowId, false])
    )
  );

  // Chargement des compétences pour les passer à ProjetsContent
  const [competencesTechniques, setCompetencesTechniques] = useState<CompetenceTechnique[]>([]);
  const [competencesComportementales, setCompetencesComportementales] = useState<CompetenceComportementale[]>([]);

  useEffect(() => {
    async function loadCompetences() {
      try {
        const response = await fetch("/api/db/competences");
        if (!response.ok) return;

        const data = await response.json();
        console.log("API /api/db/competences retourne :", data); // ← TEMP

        setCompetencesTechniques(data.competencesTechniques ?? []);
        setCompetencesComportementales(data.competencesComportementales ?? []);
      } catch (error) {
        console.error("Erreur chargement compétences :", error);
      }
    }
    loadCompetences();
  }, []);



  function openWindow(windowId: string) {
    setOpenWindowMap((previousOpenWindowMap) => ({
      ...previousOpenWindowMap,
      [windowId]: true,
    }));
  }

  function closeWindow(windowId: string) {
    setOpenWindowMap((previousOpenWindowMap) => ({
      ...previousOpenWindowMap,
      [windowId]: false,
    }));
  }

  function closeAllWindows() {
    setOpenWindowMap(
      Object.fromEntries(
        windowConfigList.map((windowConfig) => [windowConfig.windowId, false])
      )
    );
  }

  return (
    <>
      <main ref={containerRef} className="h-[92dvh] overflow-y-auto md:overflow-hidden">
        <CustomCursor />

        {/* ── Fenêtres principales ─────────────────────────── */}
        {windowConfigList.map((windowConfig) => (
          <DragWindow
            key={windowConfig.windowId}
            windowId={windowConfig.windowId}
            windowTitle={windowConfig.windowTitle}
            isOpen={openWindowMap[windowConfig.windowId]}
            onClose={() => closeWindow(windowConfig.windowId)}
            containerRef={containerRef}
            defaultPosition={windowConfig.defaultPosition}
            defaultSize={windowConfig.defaultSize}
            maxSize={windowConfig.maxSize}
          >
            {/* ProjetsContent reçoit les compétences pour les passer aux fenêtres détail */}
            {windowConfig.windowId === "window-projets" ? (
              <ProjetsContent
                competencesTechniques={competencesTechniques}
                competencesComportementales={competencesComportementales}
              />
            ) : (
              {
                "window-profile": <ProfilContent />,
                "window-parcours": <ParcoursContent />,
                "window-competences": <CompetencesContent />,
                "window-contact": <ContactContent />,
              }[windowConfig.windowId]
            )}
          </DragWindow>
        ))}

        {/* ── Fenêtres dynamiques (détails) ────────────────── */}
        {dynamicWindowList.map((dynamicWindow) => (
          <DragWindow
            key={dynamicWindow.dynamicWindowId}
            windowId={dynamicWindow.dynamicWindowId}
            windowTitle={getDynamicWindowTitle(dynamicWindow.windowData)}
            isOpen={true}
            onClose={() => closeDynamicWindow(dynamicWindow.dynamicWindowId)}
            containerRef={containerRef}
            defaultPosition={dynamicWindow.defaultPosition}
            defaultSize={{ width: 380, height: 320 }}
          >
            {getDynamicWindowContent(dynamicWindow.windowData)}
          </DragWindow>
        ))}

      </main>

      <Nav
        windowConfigList={windowConfigList}
        openWindowMap={openWindowMap}
        onOpenWindow={openWindow}
        onCloseAllWindows={closeAllWindows}
      />
    </>
  );
}
