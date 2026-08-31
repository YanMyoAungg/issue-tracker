import { Routes } from '@angular/router';
import { IssueList } from './features/issues/issue-list/issue-list';
import { IssueForm } from './features/issues/issue-form/issue-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/issues',
    pathMatch: 'full',
  },
  {
    path: 'issues',
    component: IssueList,
  },
  {
    path: 'issues/new',
    component: IssueForm,
  },
  {
    path: 'issues/:id',
    component: IssueForm,
  },
];
