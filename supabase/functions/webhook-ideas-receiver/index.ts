import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookIdeaPayload {
  success: boolean;
  ideas?: Array<{
    title: string;
    content: string;
    platform: string;
    tags: string[];
    generation_context?: any;
  }>;
  userId: string;
  brandId?: string;
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

    const payload: WebhookIdeaPayload = await req.json()
    console.log('Received webhook payload:', payload)

    if (!payload.success) {
      console.error('Generation failed:', payload.error, payload.message)
      return new Response(
        JSON.stringify({ error: 'Generation failed', details: payload.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!payload.ideas || payload.ideas.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No ideas provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Save each idea to the generated_ideas table
    const ideaInserts = payload.ideas.map(idea => ({
      user_id: payload.userId,
      brand_id: payload.brandId || null,
      title: idea.title,
      content: idea.content,
      platform: idea.platform,
      tags: idea.tags || [],
      generation_context: idea.generation_context || null,
      feedback_status: 'pending'
    }))

    const { data, error } = await supabaseClient
      .from('generated_ideas')
      .insert(ideaInserts)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save ideas', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully saved ${data.length} ideas for user ${payload.userId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        savedIdeas: data.length,
        message: 'Ideas saved successfully' 
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