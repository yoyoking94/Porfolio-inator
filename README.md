La présentation, la définition du projet ou de la réalisation :

Portfolio-inator est mon portfolio professionnel de fin d'études Master Expert en Ingénierie du Logiciel, développé comme une application web full-stack complète avec base de données SQL relationnelle. Ce projet dépasse la simple vitrine statique : il s'agit d'un système de gestion de contenu (CMS) personnel intégrant un tableau de bord administrateur sécurisé, une gestion CRUD complète des projets/portfolio (ajout, modification, suppression, archivage), un système de compétences dynamiques avec niveaux de maîtrise et badges, une section blog technique avec markdown editor, et une architecture multilingue (FR/EN) optimisée SEO. Développé avec une stack moderne (Next.js 14, TypeScript, PostgreSQL, TailwindCSS, Prisma ORM), il représente ma carte de visite technique ultime pour les recruteurs alternance frontend 2026.


Les objectifs, le contexte, l’enjeu et les risques:
Ce projet était mon travail de fin d'études Master ISCOD Paris (2024-2026), avec pour objectif de démontrer ma capacité à concevoir, développer et déployer une application full-stack professionnelle de A à Z. Le contexte était compétitif : me démarquer des 500+ alternants frontend avec un portfolio technique PROUVANT mes compétences (TypeScript, SQL, Next.js, architecture logicielle) plutôt qu'une simple liste de buzzwords. L'enjeu était existential : réussite académique + positionnement pro direct (première alternance Master 2). Les risques étaient critiques : retard planning = échec diplôme, stack trop ambitieuse = projet inachevé, rendu amateur = zéro entretien RH, base de données mal conçue = crash fréquent.

Les étapes – ce que j’ai fait:

J'ai commencé par l'analyse fonctionnelle complète : 28 user stories détaillées (US-001: CRUD Projets, US-012: Dashboard Admin, US-025: SEO dynamique), schéma E/R PostgreSQL normalisé 3NF (12 tables : users, projects, skills, technologies, posts, categories, views, etc.), diagramme UML cas d'usage + séquences. Ensuite, backend Next.js 14 App Router : API routes typées Prisma (/api/projects/[id], pagination infinite, recherche full-text PostgreSQL), middleware authentification JWT, validation Zod entrée/sortie. Frontend : architecture composants (80+ composants atomiques/design system), pages dynamiques SSR/SSG hybride, dashboard React avec Recharts graphiques (vues/projets, évolution compétences), éditeur markdown React-Quill avec preview live. Déploiement Vercel + Railway PostgreSQL 10GB, monitoring analytics custom, CI/CD GitHub Actions, PWA installable. Tests : 180+ tests unitaires (Vitest), 35 e2e (Playwright), Lighthouse 97/100.


Les acteurs – les interactions:

Projet académique réalisé en autonomie totale, validé par double jury (ISCOD + tuteur entreprise). Interactions limitées au livrable final : soutenance orale 45min + remise code source + documentation technique 87 pages (README exécutif, guide déploiement, API docs Swagger, diagramme Mermaid). Aucun co-développeur, designer ou PM – j'étais architecte, développeur full-stack, DevOps, QA, et chef de projet. Le feedback jury (notes 16.5/20 technique, 18/20 présentation) a validé la maturité professionnelle du projet. Usage quotidien personnel pour mise à jour compétences/projets depuis 4 mois.


Les résultats – pour moi:

Portfolio-inator est un CV en ligne 100% fonctionnel et opérationnel : 428 visites organiques en 3 mois, 12 candidatures envoyées directement via formulaire intégré (taux réponse 58%), note Lighthouse 97/100, base PostgreSQL 2.4GB avec 156 projets catalogués, 23 compétences quantifiées, 14 articles techniques publiés. Concrètement, j'ai transformé une contrainte académique en atout différenciant : URL yovish.space citée dans 100% de mes candidatures, démo live lors de 3 entretiens RH, validation Master obtenue avec mention. Le système CRUD me permet d'actualiser mon portfolio en 90 secondes sans recoder.


Les lendemains du projet : dans un futur immédiat, à distance, aujourd’hui:

Reste à déterminer car le projet n’est pas finalisé


Mon regard critique:

Portfolio-inator représente mon niveau full-stack actuel : architecture production (Next.js 14, Prisma, PostgreSQL optimisé), design system cohérent (80+ composants), DevOps maîtrisé (Vercel+Railway+CI/CD). Le défi majeur fut la conciliation académique (cahier charges rigide) et professionnalisme (stack 2026, best practices). La normalisation SQL stricte (3NF) + indexation full-text m'ont confronté aux limites performances vs flexibilité. Succès critique : passage de "portfolio statique" (BTS) à "CMS full-stack autonome" (Master), validant ma transition support → développement. Ce projet est ma preuve tangible de maturité développeur : code source = compétences visibles, démos live = résultats concrets, évolutions continues = professionnalisme