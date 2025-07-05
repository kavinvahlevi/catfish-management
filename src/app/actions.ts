"use server";

import { generateCareTips, type GenerateCareTipsInput, type GenerateCareTipsOutput } from "@/ai/flows/generate-care-tips";
import { diagnoseCatfish, type DiagnoseCatfishInput, type DiagnoseCatfishOutput } from "@/ai/flows/diagnose-catfish-flow";
import { generateTipsFromPrompt, type GenerateTipsFromPromptInput, type GenerateTipsFromPromptOutput } from "@/ai/flows/generate-tips-from-prompt";

export async function getCareTipsAction(input: GenerateCareTipsInput): Promise<GenerateCareTipsOutput | null> {
    try {
        const result = await generateCareTips(input);
        return result;
    } catch (error) {
        console.error("Error generating care tips:", error);
        return null;
    }
}

export async function diagnoseCatfishAction(input: DiagnoseCatfishInput): Promise<DiagnoseCatfishOutput | null> {
    try {
        const result = await diagnoseCatfish(input);
        return result;
    } catch (error) {
        console.error("Error diagnosing catfish:", error);
        return null;
    }
}

export async function generateTipsFromPromptAction(input: GenerateTipsFromPromptInput): Promise<GenerateTipsFromPromptOutput | null> {
    try {
        const result = await generateTipsFromPrompt(input);
        return result;
    } catch (error) {
        console.error("Error generating tips from prompt:", error);
        return null;
    }
}
