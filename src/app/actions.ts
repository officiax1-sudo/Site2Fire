'use server';

import { z } from 'zod';
import { generateDPadNavigationScript } from '@/ai/flows/generate-dpad-navigation-script';

const schema = z.object({
  webUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type ScriptGenerationState = {
  success: boolean;
  message: string;
  data: {
    javaScriptSnippet: string;
    explanation: string;
  } | null;
};

export async function generateScriptAction(
  webUrl: string
): Promise<ScriptGenerationState> {
  const validatedFields = schema.safeParse({ webUrl });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors[0].message,
      data: null,
    };
  }

  try {
    const result = await generateDPadNavigationScript({
      webUrl: validatedFields.data.webUrl,
      sportsRuleSet: 'General Android TV optimization',
    });
    
    return {
      success: true,
      message: 'Script generated successfully.',
      data: result,
    };
  } catch (error: any) {
    // Return a more descriptive error message to the client
    const errorMessage = error?.message || 'An unexpected error occurred during AI generation.';
    return {
      success: false,
      message: `Build Failed: ${errorMessage}`,
      data: null,
    };
  }
}
