import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../supabaseClient.js'
import Loading from '../components/Loading.jsx'

const DashboardDataContext = createContext(null)

export const useDashboardData = () => {
    const context = useContext(DashboardDataContext)
    if (!context) {
        throw new Error('useDashboardData must be used within DashboardDataProvider')
    }
    return context
}

export const DashboardDataProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null) // Generic profile
    const [authUser, setAuthUser] = useState(null) // Auth user object
    const [enrolledCourses, setEnrolledCourses] = useState([]) // For students: courses they take
    const [mentorshipEnrollments, setMentorshipEnrollments] = useState([]) // For mentors: students they teach
    const [providedCourses, setProvidedCourses] = useState([]) // For mentors: courses they offer
    const [scheduledSessions, setScheduledSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            const user = session?.user || null
            setAuthUser(user)
            console.log('🔑 Supabase Session User:', user?.id)

            let authId = localStorage.getItem('auth_id')
            const role = localStorage.getItem('auth_user_role')
            console.log('📋 Storage Check:', { authId, role })

            if (!authId) {
                console.log('🔍 AuthId missing in localStorage, searching fallbacks...')
                if (user) {
                    const { data: userData } = await supabase
                        .from('users')
                        .select('id')
                        .eq('user_id', user.id)
                        .maybeSingle()
                    
                    if (userData) {
                        authId = String(userData.id)
                        localStorage.setItem('auth_id', authId)
                        console.log('✅ Found fallback AuthId:', authId)
                    }
                }
            }

            if (!authId) {
                console.warn('❌ CRITICAL: No numeric auth ID found. Dashboard cannot load.')
                setLoading(false)
                return
            }

            console.log('💎 Final AuthId for queries:', authId)

            if (role === 'mentor') {
                console.log('🚀 INITIALIZING MENTOR DATA FLOW')
                // --- MENTOR FLOW ---
                // 1. Fetch mentor profile
                console.log('🔍 Fetching mentor profile with authId:', authId)
                const { data: profileData, error: profileError } = await supabase
                    .from('mentors_details')
                    .select('*')
                    .eq('mentor_id', authId)
                    .maybeSingle()

                if (profileError) throw profileError
                console.log('👨‍🏫 Mentor profile fetched:', profileData)
                setUserProfile(profileData)

                // Fetch courses taught by mentor including sessions and student info
                const { data: enrollments, error: enrollError } = await supabase
                    .from('classes_enrolled')
                    .select(`
                        *,
                        courses (*, course_sessions (*)),
                        student_details (student_id, name, profile_image)
                    `)
                    .eq('mentor_id', authId)

                if (enrollError) throw enrollError
                console.log('📚 Mentor enrolled courses with students:', enrollments)

                // 3. Fetch session progress for mentor's students
                const { data: progressData, error: progressError } = await supabase
                    .from('course_session_progress')
                    .select('session_id, is_completed, course_id, student_id')
                    .eq('mentor_id', authId)
                if (progressError) console.error('Error fetching mentor session progress:', progressError)

                const { data: mentorScheduled, error: scheduledError } = await supabase
                    .from('scheduled_classes')
                    .select('*, courses(title)')
                    .eq('mentor_id', authId)
                    .order('scheduled_date', { ascending: true })

                if (scheduledError) console.error('Error fetching mentor scheduled classes:', scheduledError)

                const enrichedMentorScheduled = (mentorScheduled || []).map(session => {
                    const match = (enrollments || []).find(e =>
                        String(e.course_id) === String(session.course_id) &&
                        String(e.student_id) === String(session.student_id)
                    )
                    return { ...session, classroom_name: match?.classroom_name }
                })
                setScheduledSessions(enrichedMentorScheduled)

                // Transform mentor courses with student context
                const transformed = (enrollments || []).map((enrollment, idx) => {
                    const course = enrollment.courses || {}
                    const sessionsFromDb = course.course_sessions || []
                    const student = enrollment.student_details || {}

                    // Filter progress for this specific course AND student
                    const studentCourseProgress = progressData?.filter(p =>
                        p.course_id === course.course_id &&
                        p.student_id === enrollment.student_id
                    ) || []
                    const progressMap = new Map(studentCourseProgress.map(p => [p.session_id, p.is_completed]))

                    return {
                        // Enrollment context
                        id: enrollment.id,
                        enrollment_id: enrollment.id,
                        student_id: enrollment.student_id,
                        student_name: student.name || 'Student',
                        student_image: student.profile_image,
                        mentor_id: enrollment.mentor_id,
                        course_id: enrollment.course_id,
                        status: enrollment.status || 'active',
                        classroom_name: enrollment.classroom_name,

                        // Course data
                        title: course.title || 'Unknown Course',
                        description: course.description,
                        category: course.category,
                        career_field: course.career_field,
                        skill_level: course.skill_level,
                        image:
                            course.image ||
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',

                        // Mentor info
                        mentor: profileData?.name || profileData?.full_name || 'Expert Mentor',
                        mentorImage: profileData?.profile_image,

                        // Sessions
                        sessions: sessionsFromDb
                            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                            .map((session) => {
                                const isCompleted = progressMap.get(session.id) || false
                                return {
                                    id: session.id,
                                    sessionId: session.id,
                                    title: session.title,
                                    description: session.description,
                                    duration: session.duration_minutes,
                                    orderIndex: session.order_index,
                                    completed: isCompleted,
                                    status: isCompleted ? 'completed' : 'pending'
                                }
                            }),
                        progress: sessionsFromDb.length > 0
                            ? Math.round((sessionsFromDb.filter(s => progressMap.get(s.id)).length / sessionsFromDb.length) * 100)
                            : (enrollment.progress || 0)
                    }
                })

                // 4. Fetch the actual course templates for Offered Courses from mentor_courses table with CUSTOM DETAILS
                const { data: mentorCourseDetails, error: mentorCoursesError } = await supabase
                    .from('mentor_courses')
                    .select('*, courses(*)')
                    .eq('mentor_id', authId)

                if (mentorCoursesError) {
                    console.error('Error fetching mentor course details:', mentorCoursesError)
                    setProvidedCourses([])
                } else if (mentorCourseDetails) {
                    console.log('📦 DATACORE: Raw Mentor Course Details:', mentorCourseDetails)
                    // Merge mentor-specific fields (like course_provide) with base course data
                    const mergedCourses = mentorCourseDetails.map(mc => {
                        const base = Array.isArray(mc.courses) ? (mc.courses[0] || {}) : (mc.courses || {})
                        return {
                            ...base,
                            // Use mentor's specific description if available, otherwise use base
                            description: mc.course_provide || base.description,
                            course_provide: mc.course_provide,
                            duration: mc.duration || base.duration,
                            course_fee: mc.course_fee || base.course_fee,
                            id: mc.course_id, 
                            course_id: mc.course_id
                        }
                    })
                    console.log('✅ Mentor provided courses with custom data:', mergedCourses)
                    setProvidedCourses(mergedCourses)
                } else {
                    setProvidedCourses([])
                }

                setMentorshipEnrollments(transformed)

            } else {
                // --- STUDENT FLOW ---
                // 1. Fetch student profile
                console.log('🔍 Fetching student profile with authId (numeric):', authId)
                const { data: profileData, error: profileError } = await supabase
                    .from('student_details')
                    .select('*')
                    .eq('student_id', authId)
                    .maybeSingle()

                if (profileError) throw profileError
                setUserProfile(profileData)

                // 2. Fetch enrolled courses
                const { data: enrollments, error: enrollError } = await supabase
                    .from('classes_enrolled')
                    .select(`
                        *,
                        courses (*, course_sessions (*)),
                        mentors_details (mentor_id, name, profile_image)
                    `)
                    .eq('student_id', authId)

                if (enrollError) throw enrollError

                // 3. Fetch session progress for student
                const { data: progressData, error: progressError } = await supabase
                    .from('course_session_progress')
                    .select('session_id, is_completed, course_id')
                    .eq('student_id', authId)
                if (progressError) console.error('Error fetching student session progress:', progressError)

                // 4. Fetch scheduled classes for student (strictly isolated by student_id)
                const studentAuthId = Number(authId)
                const { data: studentScheduled, error: scheduledError } = await supabase
                    .from('scheduled_classes')
                    .select('*, courses(title), mentors_details(name)')
                    .eq('student_id', studentAuthId)
                    .order('scheduled_date', { ascending: true })

                if (scheduledError) console.error('Error fetching student scheduled classes:', scheduledError)

                const enrichedStudentScheduled = (studentScheduled || []).map(session => {
                    const match = (enrollments || []).find(e =>
                        String(e.course_id) === String(session.course_id)
                    )
                    return { ...session, classroom_name: match?.classroom_name }
                })
                setScheduledSessions(enrichedStudentScheduled)

                const transformedCourses = (enrollments || []).map((enrollment, idx) => {
                    const course = enrollment.courses || {}
                    const mentor = enrollment.mentors_details || {}
                    const sessionsFromDb = course.course_sessions || []

                    // Filter progress for this specific course
                    const courseProgress = progressData?.filter(p => p.course_id === course.course_id) || []
                    const progressMap = new Map(courseProgress.map(p => [p.session_id, p.is_completed]))

                    return {
                        ...enrollment,
                        id: enrollment.id, // Explicitly set to enrollment ID
                        enrollment_id: enrollment.id,
                        course_id: course.course_id,
                        mentor_id: mentor.mentor_id,
                        title: course.title || 'Unknown Course',
                        category: course.category || 'General',
                        image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                        rating: course.rating || 4.8,
                        level: course.level || 'Beginner',
                        mentor: mentor.name || 'Expert Mentor',
                        mentorImage: mentor.profile_image,
                        progress: sessionsFromDb.length > 0
                            ? Math.round((sessionsFromDb.filter(s => progressMap.get(s.id)).length / sessionsFromDb.length) * 100)
                            : (enrollment.progress || 0),
                        status: enrollment.status || 'active',
                        sessions: sessionsFromDb
                            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                            .map((session) => {
                                const isCompleted = progressMap.get(session.id) || false
                                return {
                                    id: session.id,
                                    sessionId: session.id,
                                    title: session.title,
                                    description: session.description,
                                    duration: session.duration_minutes,
                                    orderIndex: session.order_index,
                                    status: isCompleted ? 'completed' : 'pending',
                                    completed: isCompleted
                                }
                            })
                    }
                })
                setEnrolledCourses(transformedCourses)
            }

        } catch (err) {
            console.error('Error fetching dashboard data:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (updatedData) => {
        try {
            const authId = localStorage.getItem('auth_id')
            const role = localStorage.getItem('auth_user_role')
            const table = role === 'mentor' ? 'mentors_details' : 'student_details'
            const idField = role === 'mentor' ? 'mentor_id' : 'student_id'

            console.log(`📝 Updating ${role} profile:`, updatedData)

            const { error } = await supabase
                .from(table)
                .update(updatedData)
                .eq(idField, authId)

            if (error) throw error

            // Refetch to update UI
            await fetchDashboardData()
            return { success: true }
        } catch (err) {
            console.error('Error updating profile:', err)
            return { success: false, error: err.message }
        }
    }

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData()
    }, [])

    const value = {
        authUser,
        userProfile,
        studentProfile: userProfile,
        enrolledCourses, // Use this for student role
        mentorshipEnrollments, // Use this for mentor role
        providedCourses, // Mentor's offered templates
        uniqueOfferedCourses: Array.from(new Map(mentorshipEnrollments.map(c => [c.course_id, c])).values()),
        scheduledSessions,
        loading,
        error,
        refetch: fetchDashboardData,
        updateProfile
    }

    return (
        <DashboardDataContext.Provider value={value}>
            {children}
        </DashboardDataContext.Provider>
    )
}

