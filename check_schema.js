
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zupzvpepzkjeaelxczlz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
    const tables = ['assessments', 'assessment_submissions', 'student_details', 'courses']

    for (const table of tables) {
        console.log(`\n--- Table: ${table} ---`)
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) {
            console.error(`Error fetching ${table}:`, error.message)
        } else if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]))
        } else {
            console.log('No data found in table.')
        }
    }
}

checkSchema()
