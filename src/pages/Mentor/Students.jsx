import { useState } from 'react'
import '../../App.css'

const enrolledStudents = [
  {
    id: 1,
    name: 'Sherin',
    email: 'sherin@example.com',
    courses: ['React Advanced Patterns', 'UI/UX Design Principles'],
    totalProgress: 65,
    completedCourses: 1,
    activeCourses: 1,
    lastActive: '2 hours ago',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Rahul',
    email: 'rahul@example.com',
    courses: ['DSA Mastery'],
    totalProgress: 85,
    completedCourses: 0,
    activeCourses: 1,
    lastActive: '1 day ago',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Fatima',
    email: 'fatima@example.com',
    courses: ['UI/UX Design Principles', 'System Design Fundamentals'],
    totalProgress: 40,
    completedCourses: 0,
    activeCourses: 2,
    lastActive: '3 hours ago',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Priya',
    email: 'priya@example.com',
    courses: ['React Advanced Patterns'],
    totalProgress: 100,
    completedCourses: 1,
    activeCourses: 0,
    lastActive: '1 week ago',
    status: 'Completed',
  },
  {
    id: 5,
    name: 'Amit',
    email: 'amit@example.com',
    courses: ['DSA Mastery', 'System Design Fundamentals'],
    totalProgress: 55,
    completedCourses: 0,
    activeCourses: 2,
    lastActive: '5 hours ago',
    status: 'Active',
  },
]

function Students() {
  const [filter, setFilter] = useState('all') // all, active, completed
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = enrolledStudents.filter((student) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && student.status === 'Active') ||
      (filter === 'completed' && student.status === 'Completed')

    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#22c55e'
      case 'Completed':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="dashboard-page-new">
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <div>
            <h2 className="section-title">My Students</h2>
            <p className="section-subtitle" style={{ marginTop: '8px', opacity: 0.7 }}>View all enrolled students and their progress</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="students-filters" style={{ marginTop: '24px', marginBottom: '24px' }}>
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search students by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({enrolledStudents.length})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({enrolledStudents.filter(s => s.status === 'Active').length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({enrolledStudents.filter(s => s.status === 'Completed').length})
            </button>
          </div>
        </div>

        {/* Students Grid */}
        <div className="classroom-container">
          <div className="classroom-grid">
            {filteredStudents.length === 0 ? (
              <div className="empty-state">
                <p>No students found matching your criteria.</p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const statusColor = getStatusColor(student.status)

                return (
                  <div key={student.id} className="classroom-card">
                    <div className="classroom-card-image-wrapper" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="student-avatar-large" style={{ width: '80px', height: '80px', fontSize: '2rem', background: 'white', color: '#0ca5e9', boxShadow: '0 8px 16px rgba(12, 165, 233, 0.15)' }}>
                        {student.name.charAt(0)}
                      </div>
                      <div className="classroom-status-pill" style={{ backgroundColor: statusColor }}>
                        {student.status}
                      </div>
                    </div>

                    <div className="classroom-card-content">
                      <div className="classroom-card-header">
                        <span className="classroom-category">Student</span>
                        <div className="classroom-rating">
                          <span className="star-icon" style={{ color: '#64748b', fontSize: '12px' }}>Last active: {student.lastActive}</span>
                        </div>
                      </div>

                      <h3 className="classroom-title">{student.name}</h3>
                      <p className="classroom-mentor">{student.email}</p>

                      <div className="classroom-progress-section">
                        <div className="classroom-progress-info">
                          <span className="progress-label">Overall Progress</span>
                          <span className="progress-value">{student.totalProgress}%</span>
                        </div>
                        <div className="classroom-progress-track">
                          <div
                            className="classroom-progress-fill"
                            style={{ width: `${student.totalProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="classroom-footer">
                        <button className="classroom-btn">
                          View Profile
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Students

