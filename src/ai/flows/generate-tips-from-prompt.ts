'use server';

/**
 * @fileOverview Generates personalized tips for catfish farming based on a user's free-form question.
 *
 * - generateTipsFromPrompt - A function that generates care tips based on a natural language prompt.
 * - GenerateTipsFromPromptInput - The input type for the generateTipsFromPrompt function.
 * - GenerateTipsFromPromptOutput - The return type for the generateTipsFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTipsFromPromptInputSchema = z.object({
  prompt: z.string().describe('A free-form question or prompt from the user about catfish farming.'),
});
export type GenerateTipsFromPromptInput = z.infer<typeof GenerateTipsFromPromptInputSchema>;

const GenerateTipsFromPromptOutputSchema = z.object({
  careTips: z
    .string()
    .describe(
      'Personalized tips on pond maintenance and disease prevention for catfish farming, answering the user\'s prompt.'
    ),
});
export type GenerateTipsFromPromptOutput = z.infer<typeof GenerateTipsFromPromptOutputSchema>;

export async function generateTipsFromPrompt(
  input: GenerateTipsFromPromptInput
): Promise<GenerateTipsFromPromptOutput> {
  return generateTipsFromPromptFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'generateTipsFromPromptPrompt',
  input: {schema: GenerateTipsFromPromptInputSchema},
  output: {schema: GenerateTipsFromPromptOutputSchema},
  prompt: `You are an expert in catfish farming, providing advice to farmers.

  A farmer has the following question or request:
  "{{{prompt}}}"

  Please provide clear, concise, and actionable tips or an explanation that answers their question. Structure your response in a way that is easy for a farmer to understand.

  Care Tips:`,
});

const generateTipsFromPromptFlow = ai.defineFlow(
  {
    name: 'generateTipsFromPromptFlow',
    inputSchema: GenerateTipsFromPromptInputSchema,
    outputSchema: GenerateTipsFromPromptOutputSchema,
  },
  async input => {
    const {output} = await promptTemplate(input);
    return output!;
  }
);
