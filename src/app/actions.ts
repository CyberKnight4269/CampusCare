'use server';

import { z } from 'zod';
import { analyzeIssue } from '@/ai/flows/analyze-issue';
import type { Issue } from '@/lib/types';

const issueSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters long.',
  }),
});

export async function createIssueAction(
  data: { description: string }
): Promise<Issue> {
  const validatedData = issueSchema.parse(data);

  const aiAnalysis = await analyzeIssue({ description: validatedData.description });

  if (!aiAnalysis) {
    throw new Error('Failed to get AI analysis.');
  }

  const newIssue: Issue = {
    id: crypto.randomUUID(),
    description: validatedData.description,
    status: 'Pending',
    urgencyLevel: aiAnalysis.urgencyLevel,
    suggestedSolutions: aiAnalysis.suggestedSolutions,
    createdAt: new Date().toISOString(),
  };

  return newIssue;
}
