import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, userId } = await req.json();

    if (!idea || !userId) {
      throw new Error('Missing required data');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create a simple script based on the idea
    const scriptContent = `🎬 ${idea.title}

${idea.content}

📝 Perfect for ${idea.platform} content!

Key points:
• Engaging hook: "${idea.title}"
• Main message: ${idea.content}
• Call to action: What's your experience with this?

#${idea.tags?.join(' #') || 'content'}`;

    const scriptData = {
      user_id: userId,
      title: `${idea.title} - Script`,
      script: scriptContent,
      duration: '120s',
      platform: idea.platform || 'general',
      tags: idea.tags || [],
      brand_id: idea.brand_id || null
    };

    const { data: script, error } = await supabase
      .from('scripts')
      .insert(scriptData)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, script }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});