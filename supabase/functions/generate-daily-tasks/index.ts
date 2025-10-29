import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = "AIzaSyDtm39VCg8m4kky9KIbJEO-ZT6fZJ5UCEA";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, arc, avatar } = await req.json();
    console.log("Generating tasks with preferences:", preferences);

    const prompt = `Generate 5 daily tasks for someone on a ${arc} journey.
Focus areas: ${preferences.focusAreas.join(', ')}
Difficulty: ${preferences.difficulty}
Time: ${preferences.timeAvailable}

Return ONLY this JSON array format (no other text):
[{"title": "task 1"},{"title": "task 2"},{"title": "task 3"},{"title": "task 4"},{"title": "task 5"}]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('No text generated from Gemini');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from:', generatedText);
      throw new Error('Invalid response format from Gemini');
    }

    const tasks = JSON.parse(jsonMatch[0]);
    console.log("Generated tasks:", tasks);

    return new Response(
      JSON.stringify({ tasks }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-daily-tasks function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
