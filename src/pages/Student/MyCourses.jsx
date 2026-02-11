import { useState, useEffect } from 'react'
import '../../App.css'
import CourseDetail from './CourseDetail.jsx'
import { SearchIcon } from '../../components/Icons.jsx'
import { useDashboardData } from '../../contexts/DashboardDataContext.jsx'

function MyCourses({ courses: staticCourses, onBack, onEnterClassroom, onMentorClick, setIsCourseDetailActive }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (setIsCourseDetailActive) {
      setIsCourseDetailActive(!!selectedCourse)
    }
  }, [selectedCourse, setIsCourseDetailActive])

  // Use global dashboard data from context
  const { enrolledCourses, loading, studentProfile } = useDashboardData()

  // Format current date
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onEnterClassroom={onEnterClassroom}
        onMentorClick={onMentorClick}
      />
    )
  }

  return (
    <div className="dashboard-page-v2 font-sans">
      <div className="dashboard-background-v2">
        <div className="grain-texture absolute inset-0"></div>
        <div className="dashboard-blob-1"></div>
        <div className="dashboard-blob-2"></div>
      </div>

      {/* Slimmer Premium Header */}
      <header className="dashboard-header-v2" style={{
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '12px',
        paddingBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(14, 165, 233, 0.2)'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px' }}>school</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              letterSpacing: '-0.01em',
              margin: 0
            }}>My Classrooms</h1>
          </div>
        </div>
      </header>

      {/* Premium Tab System */}
      <section className="dashboard-tabs-container-v2" style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0 5%',
        marginTop: '0px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(8px)',
          padding: '4px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
        }}>
          {['active', 'pending', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab ? '#0ea5e9' : 'transparent',
                color: activeTab === tab ? 'white' : '#64748b',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'capitalize',
                boxShadow: activeTab === tab ? '0 4px 12px rgba(14, 165, 233, 0.2)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Enhanced Course Grid V2 */}
      <section className="dashboard-course-grid-v2" style={{
        padding: '0 5% 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', gridColumn: '1 / -1' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', animation: 'spin 2s linear infinite' }}>sync</span>
            </div>
            <p>Gathering your curriculum...</p>
          </div>
        ) : enrolledCourses.filter(c => (c.status || 'active') === activeTab).length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            color: '#94a3b8',
            gridColumn: '1 / -1',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            border: '1px dashed #cbd5e1'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '16px' }}>
              {activeTab === 'active' ? 'auto_stories' : activeTab === 'pending' ? '' : 'block'}
            </span>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>No {activeTab} classrooms found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              {activeTab === 'active' ? 'Start your journey by enrolling in a course!' :
                activeTab === 'pending' ? 'Applications under review will appear here.' :
                  'Rejected or cancelled applications will appear here.'}
            </p>
          </div>
        ) : (
          enrolledCourses
            .filter(course => (course.status || 'active') === activeTab)
            .map((course) => (
              <div
                key={course.id}
                className="premium-course-card"
                onClick={() => setSelectedCourse(course)}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(14, 165, 233, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {course.level || 'Expert Path'}
                  </div>

                  {activeTab !== 'active' && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: activeTab === 'pending' ? '#f59e0b' : '#ef4444',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {activeTab}
                    </div>
                  )}
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: 'fit-content',
                    marginBottom: '12px',
                    border: '1px solid #bae6fd'
                  }}>
                    {course.classroom_name || 'General Classroom'}
                  </div>

                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '12px',
                    lineHeight: '1.4'
                  }}>{course.title}</h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <img src={course.mentorImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                      alt={course.mentor}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{course.mentor}</span>
                  </div>

                  {activeTab === 'active' && (
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Progress</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0ea5e9' }}>{course.progress || 0}%</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '3px',
                        width: '100%',
                        height: '18px',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        {[...Array(30)].map((_, i) => {
                          const isFilled = (course.progress || 0) >= ((i + 1) / 30) * 100;
                          return (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                maxWidth: '6px',
                                height: '100%',
                                background: isFilled ? 'linear-gradient(180deg, #0ea5e9 0%, #06b6d4 100%)' : '#f1f5f9',
                                borderRadius: '3px',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: isFilled ? 'scaleY(1)' : 'scaleY(0.7)',
                                boxShadow: isFilled ? '0 2px 8px rgba(14, 165, 233, 0.25)' : 'none',
                                opacity: isFilled ? 1 : 0.4
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'pending' && (
                    <div style={{
                      marginTop: 'auto',
                      padding: '12px',
                      background: '#fffbeb',
                      borderRadius: '12px',
                      border: '1px solid #fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#d97706' }}>info</span>
                      <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>Awaiting mentor approval</span>
                    </div>
                  )}

                  {activeTab === 'rejected' && (
                    <div style={{
                      marginTop: 'auto',
                      padding: '12px',
                      background: '#fef2f2',
                      borderRadius: '12px',
                      border: '1px solid #fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#dc2626' }}>cancel</span>
                      <span style={{ fontSize: '12px', color: '#991b1b', fontWeight: '500' }}>Application not successful</span>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </section>
    </div>
  )
}

export default MyCourses
