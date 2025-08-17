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
    const { 
      idea, 
      userId, 
      ideaTitle, 
      ideaDescription, 
      brandId, 
      platform, 
      tags, 
      format, 
      duration, 
      carouselLength 
    } = await req.json();

    // Support both old format (idea object) and new format (individual fields)
    const ideaData = idea || {
      title: ideaTitle,
      content: ideaDescription,
      platform: platform,
      tags: tags,
      brand_id: brandId
    };

    if (!ideaData || !userId) {
      throw new Error('Missing required data');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create a script based on the idea and format
    const formatText = format === 'carousel' 
      ? `📱 ${carouselLength}-slide carousel` 
      : `🎬 ${duration}s reel`;
    
    const scriptContent = `${formatText}: ${ideaData.title}

${ideaData.content}

📝 Perfect for ${ideaData.platform} content!

Key points:
• Engaging hook: "${ideaData.title}"
• Main message: ${ideaData.content}
• Call to action: What's your experience with this?

#${ideaData.tags?.join(' #') || 'content'}`;

    const scriptData = {
      user_id: userId,
      title: `${ideaData.title} - Script`,
      script: scriptContent,
      duration: format === 'reel' ? `${duration}s` : '120s',
      platform: ideaData.platform || 'general',
      tags: ideaData.tags || [],
      brand_id: ideaData.brand_id || brandId || null
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