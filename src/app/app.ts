import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';

const THEME_KEY = 'theme';
const DARK_CLASS = 'dark';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HlmButtonImports,
    HlmDrawerImports,
    HlmSwitchImports,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Issue Tracker');
  protected darkMode = signal(this.readSavedPreference());

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      document.documentElement.classList.toggle(DARK_CLASS, this.darkMode());

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_KEY, this.darkMode() ? 'dark' : 'light');
      }
    });
  }

  /** Reads the saved preference; falls back to the OS color scheme. */
  private readSavedPreference(): boolean {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        return saved === 'dark';
      }
    }

    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  }
}
