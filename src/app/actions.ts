"use server";

import { generateCareTips, type GenerateCareTipsInput, type GenerateCareTipsOutput } from "@/ai/flows/generate-care-tips";
import { diagnoseCatfish, type DiagnoseCatfishInput, type DiagnoseCatfishOutput } from "@/ai/flows/diagnose-catfish-flow";

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
