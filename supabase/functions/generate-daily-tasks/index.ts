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

    const prompt = `You are a motivational AI assistant helping someone on their ${arc} journey. 
Generate 5 daily tasks based on these preferences:
- Focus areas: ${preferences.focusAreas.join(', ')}
- Difficulty level: ${preferences.difficulty}
- Time available: ${preferences.timeAvailable}

Create tasks that are:
1. Specific and actionable
2. Aligned with their ${arc} character arc
3. Challenging but achievable
4. Varied across their focus areas

Return ONLY a JSON array of tasks with this exact format:
[
  {"title": "Task description here"},
  {"title": "Another task description"},
  {"title": "Third task description"},
  {"title": "Fourth task description"},
  {"title": "Fifth task description"}
]

Important: Return ONLY the JSON array, no other text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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
            maxOutputTokens: 1024,
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
