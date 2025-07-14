'use client';

import type { Issue, IssueStatus } from '@/lib/types';
import { IssueCard } from './issue-card';
import { AnimatePresence, motion } from 'framer-motion';

type IssueListProps = {
  issues: Issue[];
  onStatusChange: (id: string, status: IssueStatus) => void;
};

export function IssueList({ issues, onStatusChange }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full min-h-[300px] bg-card">
        <h3 className="text-xl font-semibold text-muted-foreground font-headline">No issues yet!</h3>
        <p className="text-sm text-muted-foreground mt-2">Submit a new maintenance request to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {issues.map((issue) => (
          <motion.div
            key={issue.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          >
            <IssueCard issue={issue} onStatusChange={onStatusChange} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
