import { siteConfig } from './config';

export type Palette = keyof typeof siteConfig.paletteConfig;

export const getPaletteClasses = (palette: Palette) => {
  const config = siteConfig.paletteConfig[palette];
  
  switch (palette) {
    case 'slate-indigo':
      return {
        primary: 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50',
        secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        accent: 'bg-indigo-500 text-white hover:bg-indigo-600',
        muted: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-700',
        card: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      };
    case 'zinc-emerald':
      return {
        primary: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50',
        secondary: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200',
        accent: 'bg-emerald-500 text-white hover:bg-emerald-600',
        muted: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
        border: 'border-zinc-200 dark:border-zinc-700',
        card: 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
      };
    case 'neutral-violet':
      return {
        primary: 'bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50',
        secondary: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200',
        accent: 'bg-violet-500 text-white hover:bg-violet-600',
        muted: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
        border: 'border-neutral-200 dark:border-neutral-700',
        card: 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
      };
    default:
      return getPaletteClasses('slate-indigo');
  }
};

export const getAccentColor = (palette: Palette) => {
  switch (palette) {
    case 'slate-indigo':
      return 'indigo';
    case 'zinc-emerald':
      return 'emerald';
    case 'neutral-violet':
      return 'violet';
    default:
      return 'indigo';
  }
};
