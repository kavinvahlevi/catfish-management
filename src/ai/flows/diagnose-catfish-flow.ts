'use server';
/**
 * @fileOverview An AI agent for diagnosing catfish health from photos.
 *
 * - diagnoseCatfish - A function that handles the catfish diagnosis process.
 * - DiagnoseCatfishInput - The input type for the diagnoseCatfish function.
 * - DiagnoseCatfishOutput - The return type for the diagnoseCatfish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCatfishInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a catfish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseCatfishInput = z.infer<typeof DiagnoseCatfishInputSchema>;

const DiagnoseCatfishOutputSchema = z.object({
  isCatfish: z
    .boolean()
    .describe('Whether or not the image appears to contain a catfish.'),
  disease: z
    .string()
    .describe(
      'The name of the identified disease or "Sehat" if the fish appears healthy. If not a catfish, this should be "Tidak teridentifikasi".'
    ),
  diagnosis: z
    .string()
    .describe(
      'A brief visual diagnosis based on the photo, explaining the signs observed.'
    ),
  recommendation: z
    .string()
    .describe(
      'A short, actionable recommendation for the farmer based on the diagnosis.'
    ),
});
export type DiagnoseCatfishOutput = z.infer<typeof DiagnoseCatfishOutputSchema>;

export async function diagnoseCatfish(
  input: DiagnoseCatfishInput
): Promise<DiagnoseCatfishOutput> {
  return diagnoseCatfishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCatfishPrompt',
  input: {schema: DiagnoseCatfishInputSchema},
  output: {schema: DiagnoseCatfishOutputSchema},
  prompt: `You are an expert veterinarian specializing in aquaculture and fish diseases, particularly for catfish (lele). Your task is to analyze an image provided by a farmer and offer a preliminary diagnosis.

Analyze the image provided below.

Photo: {{media url=photoDataUri}}

Based on your visual analysis, complete the following tasks:
1.  Determine if the creature in the image is a catfish. Set the 'isCatfish' field accordingly.
2.  If it is a catfish, carefully examine it for any signs of common diseases (e.g., white spots, fin rot, lesions, bloating, unusual coloration, parasites).
3.  Provide a concise 'diagnosis' summarizing what you see. For example, "Terdapat bintik-bintik putih di sekujur tubuh dan sirip." If the fish looks healthy, state "Ikan tampak sehat, aktif, dan tidak ada tanda-tanda penyakit."
4.  Identify the potential 'disease'. Use the common Indonesian name for the disease if possible. If the fish is healthy, set this to "Sehat". If it is not a catfish, set it to "Tidak teridentifikasi".
5.  Provide a short, practical 'recommendation' for the farmer. This could involve water quality checks, quarantine procedures, or suggesting a specific treatment type. For healthy fish, provide a simple preventive tip.

Return your response in the specified JSON format. Be concise and use clear, easy-to-understand language for a farmer.`,
});

const diagnoseCatfishFlow = ai.defineFlow(
  {
    name: 'diagnoseCatfishFlow',
    inputSchema: DiagnoseCatfishInputSchema,
    outputSchema: DiagnoseCatfishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
