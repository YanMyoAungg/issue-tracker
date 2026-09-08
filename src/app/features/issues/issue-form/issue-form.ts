import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import type { Issue, IssuePriority, IssueStatus } from '../issue.model';
import { IssueService } from '../issue.service';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-issue-form',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, InputText, Select, Textarea],
  styleUrl: './issue-form.css',
  templateUrl: './issue-form.html',
})
export class IssueForm {
  private readonly fb = inject(FormBuilder);
  private readonly issueService = inject(IssueService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditing = signal(false);
  protected readonly issueId = signal<number | null>(null);
  protected readonly statusOptions = [
    { label: 'Open', value: 'open' as IssueStatus },
    { label: 'In progress', value: 'in-progress' as IssueStatus },
    { label: 'Closed', value: 'closed' as IssueStatus },
  ];
  protected readonly priorityOptions = [
    { label: 'Low', value: 'low' as IssuePriority },
    { label: 'Medium', value: 'medium' as IssuePriority },
    { label: 'High', value: 'high' as IssuePriority },
  ];

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    status: ['open' as IssueStatus, Validators.required],
    priority: ['medium' as IssuePriority, Validators.required],
  });

  constructor() {
    const paramId = this.route.snapshot.paramMap.get('id');

    if (!paramId) {
      return;
    }

    const parsedId = Number(paramId);
    const existingIssue = this.issueService.getIssueById(parsedId);

    if (!existingIssue) {
      this.router.navigateByUrl('/issues');
      return;
    }

    this.isEditing.set(true);
    this.issueId.set(existingIssue.id);
    this.form.patchValue({
      title: existingIssue.title,
      description: existingIssue.description,
      status: existingIssue.status,
      priority: existingIssue.priority,
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const payload: Issue = {
      id: this.issueId() ?? Date.now(),
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      createdAt:
        this.issueId() !== null
          ? (this.issueService.getIssueById(this.issueId()!)?.createdAt ?? new Date().toISOString())
          : new Date().toISOString(),
    };

    if (this.isEditing()) {
      this.issueService.updateIssue(payload);
    } else {
      this.issueService.addIssue(payload);
    }

    this.router.navigateByUrl('/issues');
  }
}
