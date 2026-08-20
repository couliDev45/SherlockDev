import { DEFAULT_SKILL_CATEGORIES } from '../../src/data/portfolioData.ts';

// Les compétences ne sont pas éditées depuis le tableau de bord admin
// (aucune mutation n'existe côté frontend pour elles) : elles restent donc
// une donnée statique du code plutôt qu'une table en base.
export const SKILL_CATEGORIES = DEFAULT_SKILL_CATEGORIES;
