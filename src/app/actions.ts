"use server";

import { generateCareTips, type GenerateCareTipsInput, type GenerateCareTipsOutput } from "@/ai/flows/generate-care-tips";

export async function getCareTipsAction(input: GenerateCareTipsInput): Promise<GenerateCareTipsOutput | null> {
    try {
        const result = await generateCareTips(input);
        return result;
    } catch (error) {
        console.error("Error generating care tips:", error);
        return null;
    }
}
