import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-list',
  imports: [RouterLink, DatePipe],
  styleUrl: './issue-list.css',
  templateUrl: './issue-list.html',
})
export class IssueList {
  private readonly issueService = inject(IssueService);

  protected readonly issues = this.issueService.issues;

  protected deleteIssue(id: number): void {
    this.issueService.deleteIssue(id);
  }
}
