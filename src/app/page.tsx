'use client';

import { useState } from 'react';
import { IssueForm } from '@/components/campus-care/issue-form';
import { IssueList } from '@/components/campus-care/issue-list';
import type { Issue, IssueStatus } from '@/lib/types';
import { Logo } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

const initialIssues: Issue[] = [
    {
        id: '1',
        description: 'The projector in lecture hall B is not turning on. It seems to be a power issue as the light indicator is off.',
        status: 'Pending',
        urgencyLevel: 'Medium',
        suggestedSolutions: 'First, check if the projector is properly plugged into a working power outlet. If the issue persists, the power cable or the internal power supply might need to be replaced by a technician.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: '2',
        description: 'Graffiti on the wall near the library entrance.',
        status: 'Resolved',
        urgencyLevel: 'Low',
        suggestedSolutions: 'Schedule a cleaning crew to remove the graffiti using appropriate cleaning agents. Consider installing a camera for monitoring.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
];

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  const handleCreateIssue = (newIssue: Issue) => {
    setIssues((prevIssues) => [newIssue, ...prevIssues]);
  };

  const handleStatusChange = (id: string, status: IssueStatus) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto flex items-center gap-4">
              <div className="p-2 bg-primary rounded-lg">
                  <Logo className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-headline font-bold text-foreground">
                  CampusCare
              </h1>
          </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
          <div className="grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2">
                  <div className="sticky top-24">
                    <IssueForm onIssueCreated={handleCreateIssue} />
                  </div>
              </div>
              <div className="lg:col-span-3">
                  <div className="flex flex-col h-full">
                      <h2 className="text-2xl font-headline font-semibold mb-4">Current Issues</h2>
                      <Separator className="mb-6"/>
                      <div className="flex-grow">
                          <IssueList issues={issues} onStatusChange={handleStatusChange} />
                      </div>
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
}
