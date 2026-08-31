import { Component, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

const THEME_KEY = 'theme';
const DARK_CLASS = 'dark-mode';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggle,
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

  protected toggleTheme(event: MatSlideToggleChange): void {
    this.darkMode.set(event.checked);
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
