// Common formatters for database entities
export const formatContentIdea = (data: any) => ({
  id: data.id,
  user_id: data.user_id,
  title: data.title,
  content: data.content,
  platform: data.platform,
  tags: data.tags || [],
  created_at: data.created_at,
  updated_at: data.updated_at,
  createdAt: data.created_at // for backward compatibility
});

export const formatScript = (data: any) => ({
  id: data.id,
  user_id: data.user_id,
  title: data.title,
  script: data.script,
  duration: data.duration,
  platform: data.platform,
  tags: data.tags || [],
  created_at: data.created_at,
  updated_at: data.updated_at,
  createdAt: data.created_at // for backward compatibility
});

export const formatGeneratedIdea = (data: any) => ({
  id: data.id,
  user_id: data.user_id,
  title: data.title,
  content: data.content,
  platform: data.platform,
  tags: data.tags || [],
  feedback_status: data.feedback_status,
  generation_context: data.generation_context,
  content_idea_id: data.content_idea_id,
  created_at: data.created_at,
  updated_at: data.updated_at
});

export const formatProfile = (data: any) => ({
  id: data.id,
  user_id: data.user_id,
  display_name: data.display_name,
  full_name: data.full_name,
  plan: data.plan,
  created_at: data.created_at,
  updated_at: data.updated_at
});