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
    const [studentProfile, setStudentProfile] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            const studentId = localStorage.getItem('auth_id')

            if (!studentId) {
                console.error('No student ID found in localStorage')
                setLoading(false)
                return
            }

            // 1. Fetch student profile
            const { data: profileData, error: profileError } = await supabase
                .from('student_details')
                .select('*')
                .eq('student_id', studentId)
                .maybeSingle()

            if (profileError) throw profileError
            setStudentProfile(profileData)

            // 2. Fetch enrolled courses with full details
            const { data: enrollments, error: enrollError } = await supabase
                .from('classes_enrolled')
                .select(`
          *,
          courses (*),
          mentors_details (mentor_id, name, profile_image)
        `)
                .eq('student_id', studentId)

            if (enrollError) throw enrollError

            // Transform to consistent format
            const transformedCourses = (enrollments || []).map((enrollment, idx) => {
                const course = enrollment.courses || {}
                const mentor = enrollment.mentors_details || {}

                return {
                    id: course.course_id || idx,
                    course_id: course.course_id,
                    mentor_id: mentor.mentor_id,
                    title: course.title || 'Unknown Course',
                    category: course.category || 'General',
                    image: course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    rating: course.rating || 4.8,
                    level: course.skill_level || course.level || 'Beginner',
                    mentor: mentor.name || 'Expert Mentor',
                    mentorImage: mentor.profile_image,
                    progress: 0, // Can be extended with actual progress tracking
                    status: enrollment.status || 'active',
                    nextSession: 'Coming Soon'
                }
            })

            setEnrolledCourses(transformedCourses)

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
        studentProfile,
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
