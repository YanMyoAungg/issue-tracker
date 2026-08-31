import { Injectable, signal } from '@angular/core';

import type { Issue } from './issue.model';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private readonly initialIssues: Issue[] = [
    {
      id: 1,
      title: 'Set up issue tracker layout',
      description: 'Create the main shell and navigation for the app.',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Implement issue form',
      description: 'Add the form for creating and editing issues.',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date().toISOString(),
    },
  ];

  readonly issues = signal<Issue[]>(this.initialIssues);

  addIssue(issue: Issue): void {
    this.issues.update((current) => [issue, ...current]);
  }

  updateIssue(updatedIssue: Issue): void {
    this.issues.update((current) =>
      current.map((issue) =>
        issue.id === updatedIssue.id ? { ...issue, ...updatedIssue } : issue,
      ),
    );
  }

  deleteIssue(id: number): void {
    this.issues.update((current) => current.filter((issue) => issue.id !== id));
  }

  getIssueById(id: number): Issue | undefined {
    return this.issues().find((issue) => issue.id === id);
  }
}
