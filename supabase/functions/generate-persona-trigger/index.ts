import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { brandId, userId, niche_description, timestamp } = await req.json()
    console.log('Triggering persona generation for:', { brandId, userId, niche_description })

    const n8nWebhookUrl = 'https://n8n.srv878539.hstgr.cloud/webhook/0091a82d-dbc3-4bee-ad72-5d55b434d17a'
    
    // Send data to n8n workflow
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandId,
        userId,
        niche_description,
        timestamp
      })
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`)
    }

    console.log('Successfully triggered n8n persona generation workflow')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Persona generation workflow triggered successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error triggering persona generation:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to trigger persona generation', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})