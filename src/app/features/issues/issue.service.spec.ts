import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;

  beforeEach(() => {
    service = new IssueService();
  });

  it('should start with seeded issues', () => {
    expect(service.issues().length).toBeGreaterThan(0);
  });

  it('should add a new issue', () => {
    const before = service.issues().length;

    service.addIssue({
      id: 999,
      title: 'Add auth flow',
      description: 'Add login and register screens',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString(),
    });

    expect(service.issues().length).toBe(before + 1);
    expect(service.issues().at(-1)?.title).toBe('Add auth flow');
  });

  it('should remove an issue by id', () => {
    const issue = service.issues()[0];

    service.deleteIssue(issue.id);

    expect(service.issues().some((item) => item.id === issue.id)).toBeFalse();
  });
});
