import '../App.css'

function Classroom() {
  const enrolledCourses = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      mentor: 'Sarah Chen',
      progress: 65,
      nextSession: 'Tomorrow, 2:00 PM',
      assignments: 3,
    },
    {
      id: 2,
      title: 'UI/UX Design Principles',
      mentor: 'Michael Torres',
      progress: 40,
      nextSession: 'Friday, 10:00 AM',
      assignments: 2,
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      mentor: 'Emily Johnson',
      progress: 80,
      nextSession: 'Today, 4:00 PM',
      assignments: 1,
    },
  ]

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>My Classroom</h1>
        <p className="page-subtitle">Your active courses and learning materials</p>
      </div>

      <div className="classroom-courses">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="classroom-course-card">
            <div className="course-header">
              <div>
                <h3>{course.title}</h3>
                <p className="course-mentor">Mentor: {course.mentor}</p>
              </div>
              <div className="course-progress-circle">
                <span>{course.progress}%</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar-large">
                <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>

            <div className="course-details">
              <div className="detail-item">
                <span className="detail-label">Next Session:</span>
                <span className="detail-value">{course.nextSession}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pending Assignments:</span>
                <span className="detail-value">{course.assignments}</span>
              </div>
            </div>

            <div className="course-actions">
              <button className="primary">Continue Learning</button>
              <button className="ghost">View Materials</button>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <h2>Course Materials</h2>
        <div className="materials-grid">
          <div className="material-item">
            <div className="material-icon">📄</div>
            <div className="material-info">
              <h4>React Hooks Deep Dive</h4>
              <p>PDF • 2.4 MB</p>
            </div>
            <button className="download-btn">⬇️</button>
          </div>
          <div className="material-item">
            <div className="material-icon">🎥</div>
            <div className="material-info">
              <h4>State Management Tutorial</h4>
              <p>Video • 45 min</p>
            </div>
            <button className="download-btn">▶️</button>
          </div>
          <div className="material-item">
            <div className="material-icon">📝</div>
            <div className="material-info">
              <h4>Assignment Template</h4>
              <p>DOCX • 125 KB</p>
            </div>
            <button className="download-btn">⬇️</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Classroom
