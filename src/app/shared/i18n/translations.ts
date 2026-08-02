import { EN } from './en';
import { PT } from './pt';

// Use an interface to allow any string values, not just the literal EN strings
export interface Translation {
  introduction: {
    greeting: string;
    name: string;
    subtitle: string;
    description: string;
    studying: string;
    viewExperience: string;
    projects: string;
    location: string;
  },
  general: {
    backToTop: string;
  };
  nav: {
    experience: string;
    projects: string;
    about: string;
    contact: string;
  };
  projects: {
    title: string;
    subtitle: string;
    viewGitUrl: string;
    archDetails: string;
    liveDemo: string;
  };
  experience: {
    title: string;
    subtitle: string;
  };
  footer: {
    copyright: string;
    builtWith: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  language: {
    switch: string;
  };
}

export type Language = 'en' | 'pt';

export const TRANSLATIONS: Record<Language, Translation> = {
  en: EN,
  pt: PT,
};

export const LANGUAGE_KEY = 'portfolio-lang';
