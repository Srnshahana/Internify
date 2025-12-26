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

        {/* Students List */}
        <div className="students-list">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>No students found matching your criteria.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const statusColor = getStatusColor(student.status)
            
            return (
              <div key={student.id} className="student-card">
                <div className="student-card-header">
                  <div className="student-info">
                    <div className="student-avatar-large">
                      <span>{student.name.charAt(0)}</span>
                    </div>
                    <div className="student-details">
                      <h3 className="student-name">{student.name}</h3>
                      <p className="student-email">{student.email}</p>
                      <p className="student-last-active">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                  <div className="student-status-badge" style={{
                    backgroundColor: `${statusColor}20`,
                    color: statusColor,
                    borderColor: statusColor
                  }}>
                    {student.status}
                  </div>
                </div>

                <div className="student-courses">
                  <h4 className="courses-label">Enrolled Courses:</h4>
                  <div className="courses-tags">
                    {student.courses.map((course, idx) => (
                      <span key={idx} className="course-tag">{course}</span>
                    ))}
                  </div>
                </div>

                <div className="student-stats">
                  <div className="student-stat-item">
                    <span className="stat-label">Total Progress</span>
                    <span className="stat-value">{student.totalProgress}%</span>
                  </div>
                  <div className="student-stat-item">
                    <span className="stat-label">Active Courses</span>
                    <span className="stat-value">{student.activeCourses}</span>
                  </div>
                  <div className="student-stat-item">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{student.completedCourses}</span>
                  </div>
                </div>

                <div className="student-progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Overall Progress</span>
                    <span className="progress-percentage">{student.totalProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${student.totalProgress}%`, backgroundColor: statusColor }}
                    ></div>
                  </div>
                </div>

                <div className="student-actions">
                  <button className="btn-secondary">View Details</button>
                  <button className="btn-secondary">Message</button>
                  <button className="btn-primary">View Progress</button>
                </div>
              </div>
            )
          })
        )}
        </div>
      </div>
    </div>
  )
}

export default Students

