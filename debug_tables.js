
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://zupzvpepzkjeaelxczlz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHp2cGVwemtqZWFlbHhjemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc4MDMsImV4cCI6MjA4MTUzMzgwM30.eEKWqBAq4pbDgVGeOMkyB_31dwlMCG4Hyi-dbJtLaLQ')
async function check() {
    const list = ['scheduled_classes', 'scheduled_sessions', 'reschedule_requests', 'session_bookings', 'classes_enrolled']
    for (const t of list) {
        console.log('Checking: ' + t)
        const { data, error } = await supabase.from(t).select('*').limit(1)
        if (!error) console.log('✅ ' + t + (data?.length > 0 ? ' (data)' : ' (empty)'))
        else console.log('❌ ' + t + ': ' + error.code + ' ' + error.message)
    }
    process.exit(0)
}
check()
