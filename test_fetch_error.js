import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zupzvpepzkjeaelxczlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ'
)

async function test() {
  const mentorsRes = await supabase
    .from('mentors_details')
    .select('id, mentor_id, name, profile_image, category, about, address, is_verified, is_platformAssured, coursesOffered, rating')
  
  console.log("Error:", mentorsRes.error)
}
test()
