// This file uses server-side code.
'use server';

/**
 * @fileOverview Analyzes maintenance issue descriptions using AI to determine urgency and suggest solutions.
 *
 * - analyzeIssue - Analyzes the issue description.
 * - AnalyzeIssueInput - The input type for the analyzeIssue function.
 * - AnalyzeIssueOutput - The return type for the analyzeIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIssueInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the maintenance issue reported by the student.'),
});
export type AnalyzeIssueInput = z.infer<typeof AnalyzeIssueInputSchema>;

const AnalyzeIssueOutputSchema = z.object({
  urgencyLevel: z
    .string()
    .describe(
      'The estimated urgency level of the issue (e.g., Low, Medium, High, Critical).'
    ),
  suggestedSolutions: z
    .string()
    .describe('Potential solutions to resolve the maintenance issue.'),
});
export type AnalyzeIssueOutput = z.infer<typeof AnalyzeIssueOutputSchema>;

export async function analyzeIssue(input: AnalyzeIssueInput): Promise<AnalyzeIssueOutput> {
  return analyzeIssueFlow(input);
}

const analyzeIssuePrompt = ai.definePrompt({
  name: 'analyzeIssuePrompt',
  input: {schema: AnalyzeIssueInputSchema},
  output: {schema: AnalyzeIssueOutputSchema},
  prompt: `You are an AI assistant that analyzes maintenance issue descriptions submitted by students and provides an estimated urgency level and potential solutions.

  Description: {{{description}}}

  Based on the description, provide an urgencyLevel and suggestedSolutions. The urgencyLevel should be one of: Low, Medium, High, Critical.
  The suggestedSolutions should be a short paragraph.
  Be as concise as possible.
  `,
});

const analyzeIssueFlow = ai.defineFlow(
  {
    name: 'analyzeIssueFlow',
    inputSchema: AnalyzeIssueInputSchema,
    outputSchema: AnalyzeIssueOutputSchema,
  },
  async input => {
    const {output} = await analyzeIssuePrompt(input);
    return output!;
  }
);
