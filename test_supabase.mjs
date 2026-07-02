import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zupzvpepzkjeaelxczlz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ'
)

async function test() {
  const { data, error } = await supabase
      .from('mentors_details')
      .select('*')
      .limit(1)
  
  if (error) {
      console.error('Error:', error)
  } else {
      console.log('Columns:', Object.keys(data[0]))
  }
}

test()
