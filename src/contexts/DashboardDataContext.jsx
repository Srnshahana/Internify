import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../supabaseClient'

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
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            const authId = localStorage.getItem('auth_id')
            const role = localStorage.getItem('auth_user_role')

            if (!authId) {
                console.error('No auth ID found in localStorage')
                setLoading(false)
                return
            }

            if (role === 'mentor') {
                // --- MENTOR FLOW ---
                // 1. Fetch mentor profile
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

                // Transform mentor courses with student context
                const transformed = (enrollments || []).map((enrollment, idx) => {
                    const course = enrollment.courses || {}
                    const sessionsFromDb = course.course_sessions || []
                    const student = enrollment.student_details || {}

                    return {
                        // Enrollment context
                        enrollment_id: enrollment.id,
                        student_id: enrollment.student_id,
                        student_name: student.name || 'Student',
                        student_image: student.profile_image,
                        mentor_id: enrollment.mentor_id,
                        course_id: enrollment.course_id,

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
                            .map((session) => ({
                                id: session.id,
                                sessionId: session.id,
                                title: session.title,
                                description: session.description,
                                duration: session.duration_minutes,
                                orderIndex: session.order_index,
                                completed: false
                            }))
                    }
                })

                console.log("transformed", transformed)
                setEnrolledCourses(transformed)

            } else {
                // --- STUDENT FLOW ---
                // 1. Fetch student profile
                const { data: profileData, error: profileError } = await supabase
                    .from('student_details')
                    .select('*')
                    .eq('student_id', authId)
                    .maybeSingle()

                if (profileError) throw profileError
                setUserProfile(profileData)

                // 2. Fetch enrolled courses with full details including sessions
                const { data: enrollments, error: enrollError } = await supabase
                    .from('classes_enrolled')
                    .select(`
                        *,
                        courses (*, course_sessions (*)),
                        mentors_details (mentor_id, name, profile_image)
                    `)
                    .eq('student_id', authId)

                if (enrollError) throw enrollError
                const transformedCourses = (enrollments || []).map((enrollment, idx) => {
                    const course = enrollment.courses || {}
                    const mentor = enrollment.mentors_details || {}
                    const sessionsFromDb = course.course_sessions || []

                    return {
                        ...enrollment,
                        id: course.course_id || idx,
                        course_id: course.course_id,
                        mentor_id: mentor.mentor_id,
                        title: course.title || 'Unknown Course',
                        category: course.category || 'General',
                        image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                        rating: course.rating || 4.8,
                        level: course.level || 'Beginner',
                        mentor: mentor.name || 'Expert Mentor',
                        mentorImage: mentor.profile_image,
                        progress: enrollment.progress || 0,
                        status: enrollment.status || 'active',
                        sessions: sessionsFromDb
                            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                            .map((session) => ({
                                id: session.id,
                                sessionId: session.id,
                                title: session.title,
                                description: session.description,
                                duration: session.duration_minutes,
                                orderIndex: session.order_index,
                                status: 'pending',
                                completed: false
                            }))
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

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData()
    }, [])

    const value = {
        userProfile, // Replaces studentProfile to be generic
        studentProfile: userProfile, // Legacy support
        enrolledCourses,
        loading,
        error,
        refetch: fetchDashboardData
    }

    return (
        <DashboardDataContext.Provider value={value}>
            {children}
        </DashboardDataContext.Provider>
    )
}
