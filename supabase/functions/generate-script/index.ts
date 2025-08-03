import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, userId } = await req.json()
    
    console.log('Generating script for idea:', idea.title)
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Send webhook to n8n
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured')
    }

    console.log('Sending request to n8n webhook...')
    
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: {
          title: idea.title,
          content: idea.content,
          platform: idea.platform,
          tags: idea.tags
        },
        userId
      })
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`)
    }

    const scriptData = await n8nResponse.json()
    console.log('Received script from n8n:', scriptData)

    // Save the generated script to database
    const { data: savedScript, error } = await supabase
      .from('scripts')
      .insert({
        user_id: userId,
        title: `Script: ${idea.title}`,
        script: scriptData.script || scriptData.content,
        platform: idea.platform,
        duration: scriptData.duration || '60s',
        tags: [...(idea.tags || []), 'generated']
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving script:', error)
      throw error
    }

    console.log('Script saved successfully:', savedScript.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        script: savedScript,
        message: 'Script generated and saved successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-script function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})