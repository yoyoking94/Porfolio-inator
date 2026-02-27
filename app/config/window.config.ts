import type { WindowConfig } from "@/app/types";
import profil from '@/public/profil.svg'
import parcours from '@/public/parcours.svg'
import competences from '@/public/competences.svg'
import projets from '@/public/projets.svg'
import contact from '@/public/contact.svg'

export const windowConfigList: WindowConfig[] = [
    {
        windowId: "window-profile",
        windowTitle: "PROFIL.HTML",
        windowIcon: profil,
        defaultPosition: { x: 0, y: 0 },
        defaultSize: { width: 520, height: 420 },
    },
    {
        windowId: "window-parcours",
        windowTitle: "PARCOURS.HTML",
        windowIcon: parcours,
        defaultPosition: { x: 0, y: 446 },
        defaultSize: { width: 512, height: 520 },
        maxSize: { width: 512, height: 520 },
    },
    {
        windowId: "window-projets",
        windowTitle: "PROJETS.HTML",
        windowIcon: projets,
        defaultPosition: { x: 526, y: 0 },
        defaultSize: { width: 580, height: 966 },
    },
    {
        windowId: "window-competences",
        windowTitle: "COMPETENCES.HTML",
        windowIcon: competences,
        defaultPosition: { x: 1111, y: 0 },
        defaultSize: { width: 362, height: 620 },
        maxSize: { width: 362, height: 490 },
    },
    {
        windowId: "window-contact",
        windowTitle: "CONTACT.HTML",
        windowIcon: contact,
        defaultPosition: { x: 1479, y: 376 },
        defaultSize: { width: 280, height: 590 },
    },
];
