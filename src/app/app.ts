import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { ToggleSwitch } from 'primeng/toggleswitch';

const THEME_KEY = 'theme';
const DARK_CLASS = 'dark-mode';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ButtonDirective,
    Drawer,
    ToggleSwitch,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Issue Tracker');
  protected darkMode = signal(this.readSavedPreference());
  protected navigationOpen = signal(false);

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

  protected toggleTheme(checked: boolean): void {
    this.darkMode.set(checked);
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
