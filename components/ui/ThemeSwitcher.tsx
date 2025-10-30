import React from 'react';
import { SparkleIcon } from './icons';

type ThemeOption = {
  id: string;
  name: string;
  description: string;
  previewClass: string;
};

interface ThemeSwitcherProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'vibrant-light',
    name: 'Vibrant Light',
    description: 'Bright gradients and airy surfaces',
    previewClass: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500',
  },
  {
    id: 'vibrant-dark',
    name: 'Vibrant Dark',
    description: 'Neon accents on a midnight base',
    previewClass: 'bg-gradient-to-br from-slate-900 via-sky-700 to-cyan-500',
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum',
    description: 'Playful pastels and lively contrasts',
    previewClass: 'bg-gradient-to-br from-pink-400 via-purple-400 to-sky-400',
  },
  {
    id: 'minimalist-light',
    name: 'Minimalist Light',
    description: 'Clean neutrals with confident typography',
    previewClass: 'bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300',
  },
  {
    id: 'minimalist-dark',
    name: 'Minimalist Dark',
    description: 'Calm monochrome with soft contrast',
    previewClass: 'bg-gradient-to-br from-zinc-900 via-neutral-800 to-zinc-700',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'High-contrast black and white',
    previewClass: 'bg-gradient-to-br from-white via-gray-300 to-black',
  },
  {
    id: 'monochrome-dark',
    name: 'Noir',
    description: 'Sleek inverted monochrome palette',
    previewClass: 'bg-gradient-to-br from-black via-neutral-900 to-white/20',
  },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none flex items-center gap-2 px-4 py-2 rounded-full bg-surface/70 border border-border shadow-card text-sm font-semibold cursor-pointer transition-all hover:border-primary/60 hover:text-primary">
          <SparkleIcon className="w-4 h-4" />
          <span>Theme</span>
          <span className="text-text-muted">{themeOptions.find(option => option.id === theme)?.name ?? 'Custom'}</span>
        </summary>
        <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-surface border border-border shadow-xl rounded-2xl overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto divide-y divide-border/50">
            {themeOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={event => {
                  setTheme(option.id);
                  document.documentElement.setAttribute('data-theme', option.id);
                  const details = event.currentTarget.closest('details');
                  if (details instanceof HTMLDetailsElement) {
                    details.open = false;
                  }
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-primary/5 ${theme === option.id ? 'bg-primary/10 text-primary' : ''}`}
              >
                <span className={`w-12 h-12 rounded-xl border border-border shadow-inner ${option.previewClass}`} />
                <span>
                  <span className="block font-semibold text-sm">{option.name}</span>
                  <span className="block text-xs text-text-muted">{option.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
};

export default ThemeSwitcher;
