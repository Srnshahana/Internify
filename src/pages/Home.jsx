import '../App.css'
import dashboardIllustration from '../assets/dashboard.svg'
import careerIllustration from '../assets/career.svg'

function Home({ onNavigate }) {
  const mentors = [
    {
      name: 'James Smith',
      experience: '8 years experience',
      role: 'Mobile Application developer',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Liam Miller',
      experience: '13 years experience',
      role: 'Mobile Application developer',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Sarah Chen',
      experience: '10 years experience',
      role: 'React Native Expert',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'David Park',
      experience: '12 years experience',
      role: 'Full Stack Developer',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Emma Wilson',
      experience: '9 years experience',
      role: 'UI/UX Designer',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Michael Brown',
      experience: '15 years experience',
      role: 'DevOps Engineer',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Sophia Martinez',
      experience: '7 years experience',
      role: 'Data Scientist',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Ryan Taylor',
      experience: '11 years experience',
      role: 'Backend Developer',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces'
    },
    {
      name: 'Olivia Davis',
      experience: '6 years experience',
      role: 'Frontend Developer',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces'
    },
  ]

  const skills = [
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
    { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
    { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  ]

  const courses = [
    {
      name: 'Dart development',
      marketStanding: '3rd on market 2025',
      description: 'High demand for Dart specialists exists in junior to senior software engineering roles due to Flutter\'s growth.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg'
    },
    {
      name: 'React Native',
      marketStanding: '1st on market 2025',
      description: 'Leading framework for cross-platform mobile development with growing industry adoption.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    },
    {
      name: 'Flutter Development',
      marketStanding: '2nd on market 2025',
      description: 'Rapidly growing framework for building beautiful, natively compiled applications.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'
    },
    {
      name: 'Python Programming',
      marketStanding: '1st on market 2025',
      description: 'Most versatile programming language used in web development, data science, AI, and automation.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    },
    {
      name: 'Node.js Backend',
      marketStanding: '2nd on market 2025',
      description: 'Server-side JavaScript runtime for building scalable and efficient web applications.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    },
    {
      name: 'JavaScript Mastery',
      marketStanding: '1st on market 2025',
      description: 'Essential programming language for web development, frontend, and full-stack applications.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    },
    {
      name: 'AWS Cloud',
      marketStanding: '1st on market 2025',
      description: 'Leading cloud platform for deploying and managing scalable applications and infrastructure.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg'
    },
    {
      name: 'Docker & Kubernetes',
      marketStanding: '2nd on market 2025',
      description: 'Containerization and orchestration tools essential for modern DevOps and deployment workflows.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
    },
    {
      name: 'Machine Learning',
      marketStanding: '3rd on market 2025',
      description: 'Cutting-edge AI and ML technologies for building intelligent systems and data-driven solutions.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg'
    },
  ]

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#facc15' : '#d1d5db' }}>★</span>
    ))
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Hero Section */}
      <div className="home-hero">
        <div className="hero-illustration">
          <img 
            src={dashboardIllustration}
            alt="Person working"
            className="hero-illustration-img"
          />
        </div>
        <div className="hero-content">
          <h1 className="welcome-title">
            <span className="welcome-hi">Hi</span>
            <span className="welcome-name">Sherin</span>
          </h1>
          <p className="welcome-tagline">Your skill Your pace Your career</p>
          <p className="welcome-subtagline">Time to make your career journey exciting</p>
        </div>
      </div>

      {/* Mentor Recommendation Section */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">Mentor recomentation</h2>
          <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Explore')}>
            View more
          </button>
        </div>
        <div className="mentor-cards-scroll">
          {mentors.slice(0, 9).map((mentor, index) => (
            <div key={index} className="mentor-card-home">
              <div className="mentor-avatar-home">
                <img src={mentor.image} alt={mentor.name} />
              </div>
              <h3 className="mentor-name-home">{mentor.name}</h3>
              <p className="mentor-experience">{mentor.experience}</p>
              <p className="mentor-role-home">{mentor.role}</p>
              <div className="mentor-rating-home">
                {renderStars(mentor.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Guidance CTA */}
      <div className="career-guidance-card">
        <div className="guidance-content">
          <h3 className="guidance-title">Can't decide on your career?</h3>
          <p className="guidance-subtitle">Take guidance from professional</p>
          <button className="primary">Take your first step</button>
        </div>
        <div className="guidance-illustration">
          <img 
            src={careerIllustration}
            alt="Career guidance"
            className="guidance-illustration-img"
          />
        </div>
      </div>

      {/* Latest Skills Section */}
      <div className="dashboard-section">
        <h2 className="section-title">Latest Skills</h2>
        <div className="skills-icons-grid">
          <div className="skills-icons-track">
            {/* First set of skills */}
            {skills.map((skill, index) => (
              <div key={`skill-1-${index}`} className="skill-icon-item">
                <div className="skill-icon-large">
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <p className="skill-name">{skill.name}</p>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {skills.map((skill, index) => (
              <div key={`skill-2-${index}`} className="skill-icon-item">
                <div className="skill-icon-large">
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <p className="skill-name">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <span className="action-text">Referance meterials</span>
          <span className="action-arrow">→</span>
        </div>
        <div className="action-card">
          <span className="action-text">get certification</span>
          <span className="action-arrow">→</span>
        </div>
      </div>

      {/* Course Recommendation Section */}
      <div className="dashboard-section">
        <div className="section-header-with-button">
          <h2 className="section-title">course recomentation</h2>
          <button className="view-all-btn" onClick={() => onNavigate && onNavigate('Explore')}>
            View more
          </button>
        </div>
        <div className="course-cards-scroll">
          {courses.slice(0, 9).map((course, index) => (
            <div key={index} className="course-card-home">
              <div className="course-icon-large">
                <img src={course.icon} alt={course.name} />
              </div>
              <div className="course-content-home">
                <h3 className="course-title-home">{course.name}</h3>
                <p className="course-market">{course.marketStanding}</p>
                <p className="course-description-home">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
