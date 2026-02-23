
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://zupzvpepzkjeaelxczlz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ')

async function listTables() {
    const tables = ['classes_enrolled', 'scheduled_classes', 'course_details', 'mentors_details', 'student_details', 'assessments', 'assessment_submissions', 'session_bookings', 'enrollment_requests']
    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('*', { count: 'exact', head: true })
            if (!error) console.log('EXISTS:', table)
        } catch (e) { }
    }
}
listTables()
