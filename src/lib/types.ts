export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical' | string;

export interface Issue {
  id: string;
  description: string;
  status: IssueStatus;
  urgencyLevel: UrgencyLevel;
  suggestedSolutions: string;
  createdAt: string;
}
