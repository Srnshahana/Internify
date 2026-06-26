import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zupzvpepzkjeaelxczlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ'
)

async function run() {
  const { data: mentors } = await supabase.from('mentors_details').select('*').ilike('category', '%Mobile%')
  const { data: allMentors } = await supabase.from('mentors_details').select('*')
  
  const targetMentor = allMentors.find(m => m.name.toLowerCase().includes('david') || JSON.stringify(m).toLowerCase().includes('mobile'))
  
  const { data: mc } = await supabase.from('mentor_courses').select('*')
  const { data: courses } = await supabase.from('courses').select('*').ilike('title', '%Mobile%')
  
  console.log("Target Mentor:", JSON.stringify(targetMentor, null, 2))
  console.log("Mentor Courses:", JSON.stringify(mc.filter(m => m.mentor_id == targetMentor?.id || m.mentor_id == targetMentor?.mentor_id), null, 2))
  console.log("Courses:", JSON.stringify(courses, null, 2))
}
run()
