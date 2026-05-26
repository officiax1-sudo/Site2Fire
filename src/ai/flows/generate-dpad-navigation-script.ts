'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating D-Pad navigation JavaScript snippets.
 * It analyzes a given URL and suggests optimized JavaScript for Android TV D-Pad navigation.
 *
 * - generateDPadNavigationScript - A function that handles the D-Pad navigation script generation process.
 * - GenerateDPadNavigationScriptInput - The input type for the generateDPadNavigationScript function.
 * - GenerateDPadNavigationScriptOutput - The return type for the generateDPadNavigationScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateDPadNavigationScriptInputSchema = z.object({
  webUrl: z.string().url().describe('The URL of the website to analyze for D-Pad navigation optimization.'),
  sportsRuleSet: z.string().optional().describe('Optional: Specific sports rule set to consider for optimization.'),
});
export type GenerateDPadNavigationScriptInput = z.infer<typeof GenerateDPadNavigationScriptInputSchema>;

// Output Schema
const GenerateDPadNavigationScriptOutputSchema = z.object({
  javaScriptSnippet: z.string().describe('The generated JavaScript snippet optimized for D-Pad navigation on Android TV.'),
  explanation: z.string().describe('An explanation of the generated JavaScript and its optimization choices.'),
});
export type GenerateDPadNavigationScriptOutput = z.infer<typeof GenerateDPadNavigationScriptOutputSchema>;

export async function generateDPadNavigationScript(input: GenerateDPadNavigationScriptInput): Promise<GenerateDPadNavigationScriptOutput> {
  return generateDPadNavigationScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDPadNavigationScriptPrompt',
  input: {schema: GenerateDPadNavigationScriptInputSchema},
  output: {schema: GenerateDPadNavigationScriptOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are an expert in Android TV D-Pad navigation and JavaScript optimization. 
Your task is to generate a JavaScript snippet that enhances D-Pad navigation for a given website.

Input Web URL: {{{webUrl}}}
{{#if sportsRuleSet}}
Context: {{{sportsRuleSet}}}
{{else}}
Context: Optimize for general media and sports content.
{{/if}}

Generate a lightweight, performant JavaScript snippet that:
1. Improves focus management for remote control navigation.
2. Ensures predictable movement between interactive elements.
3. Includes comments explaining the logic.

Also, provide a detailed explanation of the choices made.`,
});

const generateDPadNavigationScriptFlow = ai.defineFlow(
  {
    name: 'generateDPadNavigationScriptFlow',
    inputSchema: GenerateDPadNavigationScriptInputSchema,
    outputSchema: GenerateDPadNavigationScriptOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI generated an empty response.');
      }
      return output;
    } catch (error: any) {
      console.error('Genkit Flow Error:', error);
      throw new Error(`AI generation failed: ${error.message || 'Unknown error'}`);
    }
  }
);
