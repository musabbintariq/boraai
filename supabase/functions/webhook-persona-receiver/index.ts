import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPersonaPayload {
  success: boolean;
  data?: {
    niche_description: string;
    demographics: {
      ageRange: string;
      gender: string;
      location: string;
      income: string;
    };
    psychographics: {
      interests: string[];
      values: string[];
      lifestyle: string;
    };
    pain_points: string[];
    goals: string[];
    preferred_platforms: string[];
    content_preferences: string[];
  };
  brandId: string;
  userId: string;
  error?: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: WebhookPersonaPayload = await req.json()
    console.log('Received persona webhook payload:', payload)

    if (!payload.success) {
      console.error('Persona generation failed:', payload.error, payload.message)
      return new Response(
        JSON.stringify({ error: 'Generation failed', details: payload.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!payload.data) {
      return new Response(
        JSON.stringify({ error: 'No persona data provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Save persona data to the target_audience_profiles table
    const personaData = {
      brand_id: payload.brandId,
      niche_description: payload.data.niche_description,
      demographics: payload.data.demographics,
      psychographics: payload.data.psychographics,
      pain_points: payload.data.pain_points,
      goals: payload.data.goals,
      preferred_platforms: payload.data.preferred_platforms,
      content_preferences: payload.data.content_preferences
    }

    const { data, error } = await supabaseClient
      .from('target_audience_profiles')
      .upsert(personaData)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save persona', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully saved persona for brand ${payload.brandId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: data,
        message: 'Persona saved successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})