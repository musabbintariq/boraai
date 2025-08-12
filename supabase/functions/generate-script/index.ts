import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Script generation function started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body received:', body);
    
    const { idea, userId } = body;
    console.log('Generating script for idea:', idea?.title);
    console.log('User ID:', userId);

    if (!idea || !userId) {
      throw new Error('Missing required parameters: idea or userId');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate script templates based on platform
    const templates = {
      instagram: [
        `🎬 ${idea.title}\n\n${idea.content}\n\n📱 Perfect for Instagram posts and stories!\n\n#content #instagram #${idea.tags?.[0] || 'social'}`,
        `✨ ${idea.title}\n\nHere's what you need to know:\n${idea.content}\n\nWhat do you think? Let me know in the comments! 👇\n\n#${idea.tags?.join(' #') || 'content'}`,
        `💡 ${idea.title}\n\n${idea.content}\n\nSave this post for later! 🔖\n\n#contentcreator #tips #${idea.tags?.[0] || 'inspiration'}`
      ],
      youtube: [
        `${idea.title}\n\nINTRO:\nHey everyone! Today I want to talk about ${idea.content.toLowerCase()}\n\nMAIN CONTENT:\n[Expand on: ${idea.content}]\n\nCONCLUSION:\nThat's a wrap! Don't forget to like and subscribe for more content like this!\n\nTAGS: ${idea.tags?.join(', ') || 'content, youtube'}`,
        `${idea.title} - Full Script\n\nHOOK: ${idea.content}\n\nSTORY/EXPLANATION:\n[Elaborate on the main points]\n\nCALL TO ACTION:\nWhat's your experience with this? Comment below!\n\n#${idea.tags?.join(' #') || 'youtube #content'}`
      ],
      default: [
        `${idea.title}\n\n${idea.content}\n\nKey takeaways:\n- [Point 1]\n- [Point 2]\n- [Point 3]\n\n#${idea.tags?.join(' #') || 'content'}`,
        `${idea.title}\n\n${idea.content}\n\nWhat's your opinion on this? Share your thoughts!\n\n${idea.tags?.map(tag => `#${tag}`).join(' ') || '#content #social'}`
      ]
    };

    // Select appropriate template
    const platformTemplates = templates[idea.platform as keyof typeof templates] || templates.default;
    const selectedTemplate = platformTemplates[Math.floor(Math.random() * platformTemplates.length)];

    // Create script data
    const scriptData = {
      user_id: userId,
      title: `${idea.title} - Script`,
      script: selectedTemplate,
      duration: `${Math.floor(Math.random() * 300) + 60}s`,
      platform: idea.platform || 'general',
      tags: idea.tags || [],
      brand_id: idea.brand_id || null
    };

    console.log('Inserting script data:', scriptData);

    // Insert script into database
    const { data: script, error } = await supabase
      .from('scripts')
      .insert(scriptData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Script created successfully:', script);

    return new Response(
      JSON.stringify({ success: true, script }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-script function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});