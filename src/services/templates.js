import { isSupabaseConfigured, supabase } from '../lib/supabase'

const TEMPLATE_COLUMNS = [
  'id',
  'slug',
  'name',
  'audience',
  'theme',
  'description',
  'demo_url',
  'tags',
  'features',
  'display_order',
].join(',')

function toTemplate(row) {
  return {
    id: row.slug,
    databaseId: row.id,
    name: row.name,
    audience: row.audience,
    theme: row.theme,
    description: row.description,
    demoUrl: row.demo_url,
    tags: row.tags,
    features: row.features,
    displayOrder: row.display_order,
  }
}

export async function fetchPublishedTemplates() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }

  const { data, error } = await supabase
    .from('templates')
    .select(TEMPLATE_COLUMNS)
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Unable to load templates: ${error.message}`)
  }

  return data.map(toTemplate)
}
