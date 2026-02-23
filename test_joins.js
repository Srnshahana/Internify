
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zupzvpepzkjeaelxczlz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkFKs() {
    // We can use RPC or query the information_schema if we have permissions, 
    // but since we are using anon key, we might not have permission to information_schema.
    // Instead, let's try different join names based on common patterns.

    const variations = [
        'student:student_id(name)',
        'student_id(name)',
        'student_details(name)',
        'students(name)',
        'user:student_id(name)'
    ]

    for (const v of variations) {
        console.log(`Testing join: ${v}`)
        const { data, error } = await supabase
            .from('assessment_submissions')
            .select(`id, ${v}`)
            .limit(1)

        if (error) {
            console.log(`  Failed: ${error.message}`)
        } else {
            console.log(`  Success! Data:`, data)
            break // Found it
        }
    }

    const assessmentVariations = [
        'assessment:assessment_id(title)',
        'assessment_id(title)',
        'assessments(title)',
        'assessment(title)'
    ]

    for (const v of assessmentVariations) {
        console.log(`Testing assessment join: ${v}`)
        const { data, error } = await supabase
            .from('assessment_submissions')
            .select(`id, ${v}`)
            .limit(1)

        if (error) {
            console.log(`  Failed: ${error.message}`)
        } else {
            console.log(`  Success! Data:`, data)
            break // Found it
        }
    }
}

checkFKs()
