import { useState } from 'react'
import '../../App.css'

const mentorCourses = [
  {
    id: 1,
    title: 'React Advanced Patterns',
    description: 'Master advanced React patterns including hooks, context, and performance optimization.',
    category: 'Programming',
    level: 'Advanced',
    type: 'Live',
    rating: 4.8,
    totalStudents: 15,
    activeStudents: 12,
    completedSessions: 45,
    totalSessions: 60,
    enrollments: 15,
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    description: 'Learn user-centered design principles, create stunning interfaces, and build a portfolio.',
    category: 'Design',
    level: 'Beginner',
    type: 'Hybrid',
    rating: 4.6,
    totalStudents: 10,
    activeStudents: 8,
    completedSessions: 30,
    totalSessions: 50,
    enrollments: 10,
    status: 'Active',
    createdAt: '2024-02-01',
  },
  {
    id: 3,
    title: 'DSA Mastery',
    description: 'Comprehensive Data Structures and Algorithms course for interview preparation.',
    category: 'Programming',
    level: 'Intermediate',
    type: 'Live',
    rating: 4.9,
    totalStudents: 25,
    activeStudents: 20,
    completedSessions: 80,
    totalSessions: 100,
    enrollments: 25,
    status: 'Active',
    createdAt: '2023-12-10',
  },
  {
    id: 4,
    title: 'System Design Fundamentals',
    description: 'Learn to design scalable systems and ace system design interviews.',
    category: 'Programming',
    level: 'Advanced',
    type: 'Live',
    rating: 4.7,
    totalStudents: 8,
    activeStudents: 5,
    completedSessions: 20,
    totalSessions: 40,
    enrollments: 8,
    status: 'Active',
    createdAt: '2024-03-01',
  },
]

function MyCourses({ onBack }) {
  const [selectedCourse, setSelectedCourse] = useState(null)

  const handleEditCourse = (courseId) => {
    console.log('Edit course:', courseId)
    // Navigate to edit course page or open modal
  }

  const handleViewEnrollments = (course) => {
    setSelectedCourse(course)
  }

  const handleBackFromEnrollments = () => {
    setSelectedCourse(null)
  }

  if (selectedCourse) {
    return (
      <div className="dashboard-page">
        <div className="course-detail-header">
          <button className="back-button" onClick={handleBackFromEnrollments}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
          <h1 className="page-title">Enrollments - {selectedCourse.title}</h1>
        </div>

        <div className="enrollments-container">
          <div className="enrollments-header">
            <div className="enrollment-stats">
              <div className="enrollment-stat-card">
                <span className="stat-label">Total Enrollments</span>
                <span className="stat-value">{selectedCourse.enrollments}</span>
              </div>
              <div className="enrollment-stat-card">
                <span className="stat-label">Active Students</span>
                <span className="stat-value">{selectedCourse.activeStudents}</span>
              </div>
              <div className="enrollment-stat-card">
                <span className="stat-label">Completion Rate</span>
                <span className="stat-value">
                  {Math.round((selectedCourse.completedSessions / selectedCourse.totalSessions) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="enrollments-list">
            {Array.from({ length: selectedCourse.enrollments }, (_, i) => {
              const studentId = i + 1
              const progress = Math.floor(Math.random() * 100)
              const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'

              return (
                <div key={studentId} className="enrollment-card">
                  <div className="enrollment-student-info">
                    <div className="student-avatar">
                      <span>{`Student ${studentId}`.charAt(0)}</span>
                    </div>
                    <div className="student-details">
                      <h3 className="student-name">Student {studentId}</h3>
                      <p className="student-email">student{studentId}@example.com</p>
                    </div>
                  </div>
                  <div className="enrollment-progress">
                    <div className="progress-header">
                      <span className="progress-label">Progress</span>
                      <span className="progress-percentage">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className={`enrollment-status ${status.toLowerCase().replace(' ', '-')}`}>
                      {status}
                    </span>
                  </div>
                  <div className="enrollment-actions">
                    <button className="btn-secondary">View Details</button>
                    <button className="btn-primary">Message</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="classroom-page-wrapper">
      <div className="course-detail-header">
        <h1 className="page-title">My Courses</h1>
      </div>

      <div className="classroom-container">
        <div className="courses-grid-elegant">
          {mentorCourses.map((course) => {
            const completionRate = Math.round((course.completedSessions / course.totalSessions) * 100)

            return (
              <div
                key={course.id}
                className="course-card-elegant"
                onClick={() => handleViewEnrollments(course)}
              >
                <div className="course-image-wrapper-elegant">
                  <img
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`} // Placeholder for now
                    alt={course.title}
                    className="course-image-elegant"
                  />
                  <div className="course-status-pill-elegant" style={{
                    backgroundColor: course.status === 'Active' ? '#0ca5e9' : '#94a3b8'
                  }}>
                    {completionRate}%
                  </div>
                </div>

                <div className="course-content-elegant">
                  <div className="course-header-elegant">
                    <span className="course-category-elegant">{course.category}</span>
                    <div className="course-rating-box">
                      <span className="star-icon">★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="course-title-elegant">{course.title}</h3>
                  <p className="course-mentor-elegant">{course.totalStudents} Students Enrolled</p>

                  <div className="course-current-session-box" style={{ borderLeft: `4px solid ${course.status === 'Active' ? '#0ca5e9' : '#94a3b8'}` }}>
                    <span className="session-label">Mentorship Status</span>
                    <h4 className="session-name">{course.completedSessions}/{course.totalSessions} Sessions Completed</h4>
                    <span className="session-time">{course.status} • {course.level}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                      className="light-theme-btn-primary"
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewEnrollments(course)
                      }}
                    >
                      Enrollments
                    </button>
                    <button
                      className="light-theme-btn-outline"
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCourse(course.id)
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyCourses

