'use server';

/**
 * @fileOverview Generates personalized tips on pond maintenance and disease prevention for catfish farming.
 *
 * - generateCareTips - A function that generates care tips based on the provided data.
 * - GenerateCareTipsInput - The input type for the generateCareTips function.
 * - GenerateCareTipsOutput - The return type for the generateCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCareTipsInputSchema = z.object({
  pondCount: z.number().describe('The number of ponds in the catfish farm.'),
  pondArea: z.number().describe('The total area of the ponds in square meters.'),
  catfishType: z.string().describe('The type of catfish being farmed.'),
  stockingDensity: z
    .number()
    .describe('The stocking density of catfish per square meter.'),
  feedType: z.string().describe('The type of feed used for the catfish.'),
  waterSource: z.string().describe('The source of water for the ponds.'),
  diseaseHistory: z
    .string()
    .describe('A summary of the disease history in the catfish farm.'),
  currentHealthStatus: z
    .string()
    .describe('The current health status of the catfish.'),
});
export type GenerateCareTipsInput = z.infer<typeof GenerateCareTipsInputSchema>;

const GenerateCareTipsOutputSchema = z.object({
  careTips: z
    .string()
    .describe(
      'Personalized tips on pond maintenance and disease prevention for catfish farming.'
    ),
});
export type GenerateCareTipsOutput = z.infer<typeof GenerateCareTipsOutputSchema>;

export async function generateCareTips(
  input: GenerateCareTipsInput
): Promise<GenerateCareTipsOutput> {
  return generateCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareTipsPrompt',
  input: {schema: GenerateCareTipsInputSchema},
  output: {schema: GenerateCareTipsOutputSchema},
  prompt: `You are an expert in catfish farming, providing advice to farmers.

  Based on the following data about the catfish farm, generate personalized tips on pond maintenance and disease prevention.

  Pond Count: {{{pondCount}}}
  Pond Area: {{{pondArea}}} square meters
  Catfish Type: {{{catfishType}}}
  Stocking Density: {{{stockingDensity}}} per square meter
  Feed Type: {{{feedType}}}
  Water Source: {{{waterSource}}}
  Disease History: {{{diseaseHistory}}}
  Current Health Status: {{{currentHealthStatus}}}

  Care Tips:`,
});

const generateCareTipsFlow = ai.defineFlow(
  {
    name: 'generateCareTipsFlow',
    inputSchema: GenerateCareTipsInputSchema,
    outputSchema: GenerateCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
