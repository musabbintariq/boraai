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
    
    console.log('Request payload:', { idea, userId })
    
    console.log('Generating script for idea:', idea.title)
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate a random script for demonstration (replace with n8n webhook when ready)
    // const n8nWebhookUrl = Deno.env.get('N8N_SCRIPT_GENERATION_WEBHOOK_URL')
    const scriptTemplates = [
      "Hook: Did you know that {topic}? Let me share why this matters to you...\n\nProblem: Many people struggle with {challenge}.\n\nSolution: Here's what actually works: {solution}\n\nCall to Action: Try this today and let me know how it goes!",
      "Start with a question: What if I told you {topic}?\n\nShare the story: {backstory}\n\nReveal the insight: The key is {insight}\n\nEnd with impact: This changed everything for me, and it can for you too.",
      "Bold statement: {topic} is not what you think it is.\n\nExplain why: Here's the truth most people miss: {truth}\n\nProvide value: Instead, do this: {actionable_tip}\n\nEngage: What's your experience with this?",
      "Personal story: Last week, {personal_experience}\n\nLesson learned: This taught me {lesson}\n\nHow to apply: You can use this by {application}\n\nQuestion: Have you experienced something similar?"
    ];

    const randomTemplate = scriptTemplates[Math.floor(Math.random() * scriptTemplates.length)];
    
    // Replace placeholders with content from the idea
    const generatedScript = randomTemplate
      .replace(/{topic}/g, idea.title)
      .replace(/{challenge}/g, `understanding ${idea.platform} content`)
      .replace(/{solution}/g, idea.content.substring(0, 100) + "...")
      .replace(/{backstory}/g, `I was working on ${idea.platform} content`)
      .replace(/{insight}/g, idea.content.substring(0, 80) + "...")
      .replace(/{truth}/g, `${idea.platform} success requires authenticity`)
      .replace(/{actionable_tip}/g, idea.content.substring(0, 120) + "...")
      .replace(/{personal_experience}/g, `I discovered something about ${idea.title.toLowerCase()}`)
      .replace(/{lesson}/g, idea.content.substring(0, 90) + "...")
      .replace(/{application}/g, `focusing on ${idea.platform} best practices`);

    const scriptData = {
      script: generatedScript,
      duration: ['30s', '60s', '90s', '2min'][Math.floor(Math.random() * 4)],
      content: generatedScript
    };

    console.log('Generated random script:', scriptData);

    // Save the generated script to database
    const { data: savedScript, error } = await supabase
      .from('scripts')
      .insert({
        user_id: userId,
        title: `Script: ${idea.title}`,
        script: scriptData.script || scriptData.content,
        platform: idea.platform,
        duration: scriptData.duration || '60s',
        tags: [...(idea.tags || []), 'generated'],
        brand_id: idea.brand_id || null
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