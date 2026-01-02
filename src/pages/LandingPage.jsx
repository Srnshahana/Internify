import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mentors, courses } from '../Data.jsx'
import { SunIcon, MoonIcon, ProgrammingIcon, DesignIcon, AIIcon, BusinessIcon, DataIcon, MarketingIcon, CloudIcon, SecurityIcon, WritingIcon } from '../components/Icons.jsx'
import backgroundImage from '../assets/background.png'
import supabase from '../supabaseClient'
import LightThemeLandingPage from './LightThemeLandingPage.jsx'
import '../App.css'

// Company Icon Helper
const getCompanyIcon = (companyName) => {
  if (!companyName) return null
  
  const company = companyName.toLowerCase()
  const iconSize = 20
  
  // Google
  if (company.includes('google')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    )
  }
  
  // Microsoft
  if (company.includes('microsoft')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M0 0h11.377v11.372H0z" fill="#f25022"/>
        <path d="M12.623 0H24v11.372H12.623z" fill="#00a4ef"/>
        <path d="M0 12.628h11.377V24H0z" fill="#7fba00"/>
        <path d="M12.623 12.628H24V24H12.623z" fill="#ffb900"/>
      </svg>
    )
  }
  
  // Amazon
  if (company.includes('amazon')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FF9900">
        <path d="M16.417 9.58a1.03 1.03 0 0 0-1.09.238 3.08 3.08 0 0 1-2.21.888 2.15 2.15 0 0 1-1.44-.5 1.56 1.56 0 0 1-.19-1.94c.33-.506.94-.842 1.56-1.375a4.02 4.02 0 0 0 1.38-2.526c.07-.72-.08-1.38-.47-1.95a3.6 3.6 0 0 0-1.5-1.29 4.12 4.12 0 0 0-2.13-.36 3.8 3.8 0 0 0-2.49 1.39c-.28.3-.5.65-.66 1.03a1.11 1.11 0 0 0 .5 1.5c.4.2.87.12 1.2-.19.28-.26.45-.6.5-.98a1.3 1.3 0 0 1 .81-1.11 1.25 1.25 0 0 1 1.21.08c.3.2.5.55.5.92 0 .7-.2 1.36-.6 1.95-.5.73-1.18 1.2-1.97 1.42a.5.5 0 0 0-.4.49v5.33a.5.5 0 0 0 .17.37c.2.16.5.2.75.08 2.5-1.08 4.47-2.9 5.58-5.25a.5.5 0 0 0-.15-.68zm-1.32 4.38c-.08.06-.17.1-.27.12-.1.02-.2.02-.3 0a4.1 4.1 0 0 1-2.85-2.35.5.5 0 0 0-.93.26 5.2 5.2 0 0 0 3.64 3.06c.22.05.44.05.66 0a.5.5 0 0 0 .35-.65 5.1 5.1 0 0 1-.26-1.44z"/>
        <path d="M19.98 19.19a.5.5 0 0 1-.7.7l-2.3-2.3a.5.5 0 0 1 .7-.7l2.3 2.3z"/>
      </svg>
    )
  }
  
  // Meta/Facebook
  if (company.includes('meta') || company.includes('facebook')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#0084FF">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
  
  // Apple
  if (company.includes('apple')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#000000">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    )
  }
  
  // Netflix
  if (company.includes('netflix')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E50914">
        <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.924-.004-15.71-.002-22.95zM5.398 0L18.601 24H24L10.603 0H5.398z"/>
      </svg>
    )
  }
  
  // Tesla
  if (company.includes('tesla')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#E31937">
        <path d="M12 5.362l-8.5-4.362v4.362h17V1L12 5.362zm0 1.276l8.5 4.362v8.724H3.5V11l8.5-4.362zm0 1.276L3.5 12v8.724h17V12l-8.5-4.362z"/>
      </svg>
    )
  }
  
  // GitHub
  if (company.includes('github')) {
    return (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
  
  // Default company icon
  return (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

const howItWorksSteps = [
  {
    number: 1,
    title: 'Explore',
    description: 'Browse our curated selection of mentors and courses tailored to your career goals.',
  },
  {
    number: 2,
    title: 'Connect',
    description: 'Book a free introductory session with your chosen mentor to discuss your learning path.',
  },
  {
    number: 3,
    title: 'Schedule',
    description: 'Set up weekly mentoring sessions that fit your schedule and learning pace.',
  },
  {
    number: 4,
    title: 'Learn',
    description: 'Work on real-world projects with personalized guidance and feedback from your mentor.',
  },
  {
    number: 5,
    title: 'Advance',
    description: 'Build job-ready skills and advance your career with ongoing mentor support.',
  },
]

const highlights = [
  'Freshers (main focus): Get job-ready with guided projects and interview prep.',
  'Upskillers: Close gaps fast with weekly mentor feedback.',
  'Hobby learning: Build portfolio-worthy side projects with expert guidance.',
  'Final-year projects: Ship capstones with industry-grade rigor and reviews.',
  'In any category above, Internify gives you real mentors, real direction.',
]

const outcomes = [
  {
    title: 'Course Packages',
    text: 'Structured courses focused on real, job-ready skills like mobile app development, web development, and more.',
    circleText: 'COURSE',
  },
  {
    title: 'Project Packages',
    text: 'Hands-on project building with mentor guidance to create real apps, case studies, and portfolio-ready work.',
    circleText: 'PROJECT',
  },
  {
    title: 'Career Guidance Sessions',
    text: 'One-on-one mentorship sessions to get career clarity, plan your path, and gain confidence — typically 1-hour focused calls.',
    circleText: 'CAREER',
  },
]

// Career Guidance Sessions data (using stacked testimonials design)
const careerGuidanceTestimonials = [
  {
    id: 1,
    mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    mentorName: 'Sarah Chen',
    mentorRole: 'Career Advisor',
    quote: 'My career guidance sessions helped me transition from a non-tech background to landing my dream job at Google. The personalized guidance and real-world projects made all the difference.',
    studentName: 'Alex Johnson',
    studentRating: 5,
    bgColor: 'cream'
  },
  {
    id: 2,
    mentorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    mentorName: 'Michael Rodriguez',
    mentorRole: 'Life Advisor',
    quote: 'The career guidance program exceeded my expectations. I built a portfolio that got me multiple job offers within 3 months of completing the program.',
    studentName: 'Emma Williams',
    studentRating: 5,
    bgColor: 'mint'
  },
  {
    id: 3,
    mentorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    mentorName: 'David Kim',
    mentorRole: 'Career Coach',
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.',
    studentName: 'James Brown',
    studentRating: 5,
    bgColor: 'blue'
  },
  {
    id: 4,
    mentorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    mentorName: 'Priya Patel',
    mentorRole: 'Career Strategist',
    quote: 'The weekly sessions kept me accountable and motivated. My advisor\'s feedback on my career path was invaluable in improving my approach.',
    studentName: 'Sophia Martinez',
    studentRating: 5,
    bgColor: 'cream'
  },
  {
    id: 5,
    mentorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    mentorName: 'Robert Taylor',
    mentorRole: 'Life Coach',
    quote: 'I learned more in 3 months with my advisor than I did in a year of self-study. The hands-on approach and industry insights were game-changing.',
    studentName: 'Daniel Lee',
    studentRating: 5,
    bgColor: 'mint'
  },
  {
    id: 6,
    mentorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    mentorName: 'Lisa Anderson',
    mentorRole: 'Career Mentor',
    quote: 'My advisor helped me build a portfolio that showcased my skills perfectly. I landed my first design role at a top tech company thanks to their guidance.',
    studentName: 'Olivia Davis',
    studentRating: 5,
    bgColor: 'blue'
  },
]

// Student Testimonials data (for new layout)
const studentTestimonials = [
  {
    id: 1,
    type: 'featured',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    title: 'How Students Land Their Dream Jobs Through Mentorship',
    description: 'Discover how personalized mentorship helps students transition from learning to landing roles at top tech companies.',
    category: 'Success Stories'
  },
  {
    id: 2,
    type: 'story',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    name: 'Emma Williams',
    role: 'Software Engineer at Microsoft',
    title: 'From Self-Taught to Software Engineer',
    description: 'Emma shares her journey from learning to code independently to landing her dream role with mentor guidance.',
    category: 'Student Journey'
  },
  {
    id: 3,
    type: 'insight',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=500&fit=crop',
    title: 'Building a Portfolio That Gets You Hired',
    description: 'Learn the key strategies for creating a portfolio that stands out to employers and showcases your real-world skills.',
    category: 'Career Tips'
  },
]

// Simple Testimonials for new card layout
const simpleTestimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Software Engineer',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    quote: 'Internify helped me transition from a non-tech background to landing my dream job at Google. The personalized mentorship was exactly what I needed.'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    quote: 'The career guidance program exceeded my expectations. I built a portfolio that got me multiple job offers within 3 months of completing the program.'
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    role: 'Data Scientist',
    company: 'Amazon',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    quote: 'I was stuck in my career, but my advisor provided clarity and direction. Now I\'m working on exciting ML projects and loving every moment.'
  },
  {
    id: 4,
    name: 'Emma Williams',
    role: 'Full Stack Developer',
    company: 'Netflix',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    quote: 'The weekly sessions kept me accountable and motivated. My mentor\'s feedback was invaluable in improving my approach and landing my role.'
  },
  {
    id: 5,
    name: 'James Brown',
    role: 'DevOps Engineer',
    company: 'Meta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    quote: 'I learned more in 3 months with my mentor than I did in a year of self-study. The hands-on approach and industry insights were game-changing.'
  },
  {
    id: 6,
    name: 'Sophia Martinez',
    role: 'UX Designer',
    company: 'Apple',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    quote: 'My mentor helped me build a portfolio that showcased my skills perfectly. I landed my first design role at a top tech company thanks to their guidance.'
  },
  {
    id: 7,
    name: 'Daniel Lee',
    role: 'Cloud Architect',
    company: 'AWS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    quote: 'The structured learning path and real-world projects made all the difference. I now have the confidence and skills to tackle complex cloud challenges.'
  },
  {
    id: 8,
    name: 'Olivia Davis',
    role: 'Security Engineer',
    company: 'Cisco',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
    quote: 'Internify gave me the mentorship I needed to break into cybersecurity. My mentor\'s industry expertise was instrumental in my success.'
  },
  {
    id: 9,
    name: 'David Kim',
    role: 'Machine Learning Engineer',
    company: 'Tesla',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    quote: 'The personalized mentorship helped me understand ML concepts deeply. I\'m now working on autonomous vehicle systems at Tesla.'
  },
  {
    id: 10,
    name: 'Priya Patel',
    role: 'Mobile Developer',
    company: 'Uber',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    quote: 'Switching careers seemed daunting, but my mentor made the transition smooth. I\'m now building mobile apps that millions of people use daily.'
  },
  {
    id: 11,
    name: 'Robert Taylor',
    role: 'Frontend Engineer',
    company: 'Shopify',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
    quote: 'The project-based learning approach was exactly what I needed. I built real applications during my mentorship that became part of my portfolio.'
  },
  {
    id: 12,
    name: 'Lisa Anderson',
    role: 'Backend Developer',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop',
    quote: 'My mentor helped me understand backend systems architecture. I now work on payment infrastructure that processes billions of dollars.'
  },
  {
    id: 13,
    name: 'Chris Wilson',
    role: 'AI Researcher',
    company: 'OpenAI',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    quote: 'The mentorship program gave me the foundation I needed to pursue AI research. I\'m now working on cutting-edge language models.'
  },
  {
    id: 14,
    name: 'Maria Garcia',
    role: 'Systems Engineer',
    company: 'IBM',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
    quote: 'I gained both technical skills and confidence through Internify. My mentor\'s guidance helped me excel in systems engineering interviews.'
  },
  {
    id: 15,
    name: 'Kevin Zhang',
    role: 'Platform Engineer',
    company: 'Salesforce',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    quote: 'The mentorship experience was transformative. I learned platform engineering best practices and landed a role at a top SaaS company.'
  },
]

// Map courses to skills format for Latest Skills section
const latestSkills = courses.slice(0, 8).map((course) => ({
  id: course.id,
  name: course.name,
  image: course.image,
  category: course.category,
  description: course.description,
}))

// Helper function to normalize mentor data from API
const getMentorData = (mentor) => {
  // Check if it's API structure (has mentor_id or profile_image)
  const isApiStructure = mentor.mentor_id !== undefined || mentor.profile_image !== undefined
  
  if (isApiStructure) {
    // Extract experience years from experience array
    let experienceYears = 0
    if (mentor.experience && Array.isArray(mentor.experience) && mentor.experience.length > 0) {
      const firstExp = mentor.experience[0]
      experienceYears = firstExp?.years || firstExp?.years_of_experience || firstExp?.duration || 0
      if (typeof firstExp === 'object' && firstExp.years) {
        experienceYears = firstExp.years
      }
    }
    
    // Extract skill names from skills array
    const skillNames = mentor.skills && Array.isArray(mentor.skills)
      ? mentor.skills.map(skill => {
          if (typeof skill === 'string') return skill
          return skill.name || skill.skill_name || skill.title || ''
        }).filter(Boolean)
      : []
    
    // Get expertise areas
    const expertise = mentor.experties_in || []
    
    // Get name
    const name = mentor.name || mentor.full_name || mentor.first_name || mentor.username || 'Mentor'
    
    // Get role/company from experience array
    const currentExp = mentor.experience && Array.isArray(mentor.experience) && mentor.experience.length > 0
      ? mentor.experience[0]
      : null
    const role = currentExp?.role || currentExp?.job_title || currentExp?.position || mentor.role || ''
    const company = currentExp?.company || currentExp?.organization || currentExp?.employer || mentor.company || ''
    
    // Get category
    const categoryDisplay = Array.isArray(mentor.category) 
      ? mentor.category.join(', ') 
      : mentor.category || ''
    
    return {
      id: mentor.mentor_id || mentor.id,
      mentor_id: mentor.mentor_id || mentor.id,
      name,
      role,
      company,
      image: mentor.profile_image || mentor.image,
      bio: mentor.bio ? mentor.bio.replace(/[""]/g, '').trim() : '',
      focus: expertise.length > 0 ? expertise.join(', ') : mentor.focus || '',
      expertise: expertise,
      skills: skillNames.length > 0 ? skillNames : expertise,
      category: categoryDisplay,
      assured: mentor.is_verified || mentor.assured || false,
      experience: experienceYears,
      rating: mentor.rating || mentor.avg_rating || 4.5,
      reviews: mentor.reviews || mentor.total_reviews || 0,
      hourlyRate: mentor.hourly_rate || mentor.hourlyRate || 50,
      location: mentor.location || '',
      ...mentor
    }
  }
  
  // Static structure - return as is
  return mentor
}

// Helper function to render stars
const renderStarsHelper = (score) => {
  const full = Math.floor(score)
  const half = score - full >= 0.5
  const stars = Array(5).fill('☆').map((star, i) => {
    if (i < full) return '★'
    if (i === full && half) return '½'
    return '☆'
  }).join('')
  return stars
}

export default function LandingPage({ 
  onOpenExplore, 
  onOpenResources, 
  onOpenLogin,
  onMentorClick,
  onBookSession,
  renderStars 
}) {
  const navigate = useNavigate()
  const mentorTrackRef = useRef(null)
  const skillsTrackRef = useRef(null)
  const outcomesSectionRef = useRef(null)
  const highlightsSectionRef = useRef(null)
  const howItWorksSectionRef = useRef(null)
  const testimonialsTrackRef = useRef(null)
  const testimonialsRightRef = useRef(null)
  const careerGuidanceTrackRef = useRef(null)
  const careerGuidanceRightRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'dark'
  })
  const categoryScrollRef = useRef(null)
  const heroSectionRef = useRef(null)
  const [apiMentors, setApiMentors] = useState([])
  const [isLoadingMentors, setIsLoadingMentors] = useState(true)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [currentCareerGuidanceIndex, setCurrentCareerGuidanceIndex] = useState(0)
  const [currentSimpleTestimonialPage, setCurrentSimpleTestimonialPage] = useState(1)
  const [contactEmail, setContactEmail] = useState('')

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoadingMentors(true)
        const { data: mentorsFromApi, error: mentorsError } = await supabase
          .from('mentors_details')
          .select('*')
          .limit(5) // Get top 5 for the landing page

        if (mentorsError) {
          console.error('Error fetching mentors:', mentorsError)
          setApiMentors([])
        } else {
          setApiMentors(mentorsFromApi || [])
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
        setApiMentors([])
      } finally {
        setIsLoadingMentors(false)
      }
    }

    fetchMentors()
  }, [])

  // Use renderStars prop if provided, otherwise use helper
  const renderStarsFunc = renderStars || renderStarsHelper

  // Get mentors to display - use API mentors if available, otherwise fall back to static
  const mentorsToDisplay = apiMentors.length > 0 
    ? apiMentors.map(mentor => getMentorData(mentor))
    : mentors.slice(0, 5)

  // Career Guidance depth stack navigation
  const scrollCareerGuidance = (direction) => {
    if (direction === 'right') {
      setCurrentCareerGuidanceIndex((prev) => 
        prev < careerGuidanceTestimonials.length - 1 ? prev + 1 : prev
      )
    } else {
      setCurrentCareerGuidanceIndex((prev) => 
        prev > 0 ? prev - 1 : prev
      )
    }
  }

  // Mouse tracking for gradient effect
  useEffect(() => {
    const heroSection = heroSectionRef.current
    if (!heroSection) return

    const handleMouseMove = (e) => {
      const rect = heroSection.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      heroSection.style.setProperty('--mouse-x', `${x}%`)
      heroSection.style.setProperty('--mouse-y', `${y}%`)
    }

    heroSection.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Additional icon components
  const TargetIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )

  const FinanceIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )

  const ProductIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" x2="9" y1="3" y2="21" />
      <line x1="3" x2="21" y1="12" y2="12" />
    </svg>
  )

  const MobileIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" x2="12" y1="18" y2="18" />
    </svg>
  )

  const WebIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )

  const DevOpsIcon = ({ className = "" }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  )

  // Category data with icons
  const categories = [
    { id: 'engineering', name: 'Engineering', icon: ProgrammingIcon, searchTerm: 'engineering' },
    { id: 'design', name: 'Design', icon: DesignIcon, searchTerm: 'design' },
    { id: 'ai', name: 'AI', icon: AIIcon, searchTerm: 'ai' },
    { id: 'leadership', name: 'Leadership', icon: BusinessIcon, searchTerm: 'leadership' },
    { id: 'career-guidance', name: 'Career Guidance', icon: TargetIcon, searchTerm: 'career guidance' },
    { id: 'marketing', name: 'Marketing', icon: MarketingIcon, searchTerm: 'marketing' },
    { id: 'data-science', name: 'Data Science', icon: DataIcon, searchTerm: 'data science' },
    { id: 'cloud', name: 'Cloud', icon: CloudIcon, searchTerm: 'cloud' },
    { id: 'security', name: 'Security', icon: SecurityIcon, searchTerm: 'security' },
    { id: 'writing', name: 'Writing', icon: WritingIcon, searchTerm: 'writing' },
    { id: 'finance', name: 'Finance', icon: FinanceIcon, searchTerm: 'finance' },
    { id: 'product', name: 'Product', icon: ProductIcon, searchTerm: 'product' },
    { id: 'mobile', name: 'Mobile', icon: MobileIcon, searchTerm: 'mobile' },
    { id: 'web', name: 'Web', icon: WebIcon, searchTerm: 'web' },
    { id: 'devops', name: 'DevOps', icon: DevOpsIcon, searchTerm: 'devops' },
  ]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Scroll-triggered animations
  useEffect(() => {
    let observer
    let timeoutId

    const initAnimations = () => {
      const allAnimatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
      )
      
      const animatedElements = Array.from(allAnimatedElements).filter(
        (el) => !el.closest('.outcomes') && !el.closest('.how-it-works')
      )
      
      animatedElements.forEach((el) => {
        el.classList.remove('visible')
      })

      const observerOptions = {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '0px 0px 200px 0px',
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target.closest('.outcomes') || entry.target.closest('.how-it-works')) return
          
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      }, observerOptions)

      animatedElements.forEach((el) => {
        observer.observe(el)
      })
    }

    timeoutId = setTimeout(initAnimations, 150)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (observer) {
        const animatedElements = document.querySelectorAll(
          '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
        )
        animatedElements.forEach((el) => observer.unobserve(el))
      }
    }
  }, [])

  // Intersection Observer for outcomes section animation
  useEffect(() => {
    if (!outcomesSectionRef.current) return

    const outcomesSection = outcomesSectionRef.current
    const outcomesLeft = outcomesSection.querySelector('.outcomes-left.animate-section')
    const outcomesRightItems = outcomesSection.querySelectorAll('.outcomes-right .fade-in-right')

    if (outcomesRightItems.length === 0) {
      return
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (outcomesLeft) {
            outcomesLeft.classList.add('visible')
          }
          
          outcomesRightItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible')
            }, index * 200)
          })
          
          observer.unobserve(outcomesSection)
        }
      })
    }, observerOptions)

    observer.observe(outcomesSection)

    return () => {
      if (outcomesSection) {
        observer.unobserve(outcomesSection)
      }
    }
  }, [])

  // Intersection Observer for highlights section animation
  useEffect(() => {
    if (!highlightsSectionRef.current) return

    const highlightsSection = highlightsSectionRef.current
    const highlightItems = highlightsSection.querySelectorAll('.highlight-animate')

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          highlightItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible')
            }, index * 200)
          })
          
          observer.unobserve(highlightsSection)
        }
      })
    }, observerOptions)

    observer.observe(highlightsSection)

    return () => {
      if (highlightsSection) {
        observer.unobserve(highlightsSection)
      }
    }
  }, [])

  // Intersection Observer for How It Works section animation
  useEffect(() => {
    if (!howItWorksSectionRef.current) return

    const howItWorksSection = howItWorksSectionRef.current
    const stepItems = howItWorksSection.querySelectorAll('.step-animate')

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stepItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible')
            }, index * 200)
          })
          
          observer.unobserve(howItWorksSection)
        }
      })
    }, observerOptions)

    observer.observe(howItWorksSection)

    return () => {
      if (howItWorksSection) {
        observer.unobserve(howItWorksSection)
      }
    }
  }, [])

  // Auto-scroll for skills slider
  useEffect(() => {
    const skillsTrack = skillsTrackRef.current
    if (!skillsTrack) return

    let scrollInterval
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (skillsTrack) {
          const maxScroll = skillsTrack.scrollWidth - skillsTrack.clientWidth
          const currentScroll = skillsTrack.scrollLeft
          
          if (currentScroll >= maxScroll - 10) {
            skillsTrack.scrollTo({ left: 0, behavior: 'smooth' })
          } else {
            skillsTrack.scrollBy({ left: 300, behavior: 'smooth' })
          }
        }
      }, 3000)
    }

    startAutoScroll()

    const handleMouseEnter = () => clearInterval(scrollInterval)
    const handleMouseLeave = () => startAutoScroll()

    skillsTrack.addEventListener('mouseenter', handleMouseEnter)
    skillsTrack.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(scrollInterval)
      skillsTrack.removeEventListener('mouseenter', handleMouseEnter)
      skillsTrack.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // If light theme, render the light theme landing page
  if (theme === 'light') {
    return (
      <LightThemeLandingPage
        onOpenExplore={onOpenExplore}
        onOpenResources={onOpenResources}
        onOpenLogin={onOpenLogin}
        onMentorClick={onMentorClick}
        onBookSession={onBookSession}
        renderStars={renderStarsFunc}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    )
  }

  const scrollMentors = (dir) => {
    const el = mentorTrackRef.current
    if (!el) return
    const distance = el.clientWidth * 0.8
    el.scrollBy({ left: dir === 'next' ? distance : -distance, behavior: 'smooth' })
  }

  const handleSearch = () => {
    const q = searchTerm.trim().toLowerCase()
    navigate(`/explore?q=${encodeURIComponent(q)}`)
  }

  const handleNavSearch = (term) => {
    const q = term.toLowerCase()
    setSearchTerm(term)
    navigate(`/explore?q=${encodeURIComponent(q)}`)
  }

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200
      categoryScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="page landing-page-new">
      <div className="hero-section-wrapper" ref={heroSectionRef}>
        <div className="hero-animated-bg"></div>
        <div className="topbar-new">
          <div className="brand">
            <span>Internify.</span>
          </div>
          <div className="top-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="link" onClick={() => navigate('/login')}>Login</button>
            <button className="pill">Apply as mentor</button>
          </div>
        </div>

        <header className="hero-new">
        <h1 className="hero-title">Find your mentor</h1>
        <p className="hero-description">
          Internify: connect with industry mentors for your career journey and skill development.
        </p>
        <div className="hero-search-container">
          <div className="hero-search-box">
            <div className="search-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2H16V18H4V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6L12 10L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder='Try "Video Production"'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
              className="hero-search-input"
            />
            <button className="hero-search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        <div className="category-scroll-container">
          <div className="category-scroll" ref={categoryScrollRef}>
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  className="category-tag"
                  onClick={() => handleNavSearch(category.searchTerm)}
                >
                  <div className="category-icon">
                    <IconComponent className="category-icon-svg" />
                  </div>
                  <div className="category-name">{category.name}</div>
                </button>
              )
            })}
          </div>
        </div>
      </header>
      </div>

      <section className="coaching-solutions-section">
        <div className="coaching-solutions-container">
          <div className="coaching-solutions-content">
            <p className="coaching-solutions-eyebrow">FROM LEARNING TO CAREER SUCCESS</p>
            <h2 className="coaching-solutions-title">Mentorship Solutions for Every Ambition</h2>
            <p className="coaching-solutions-description">
              Whether you're building skills, launching a career, advancing professionally, or guiding others as a mentor, Internify gives you the tools, programs, and support to reach your next level.
            </p>
            <ul className="coaching-solutions-list">
              <li className="coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Students:</strong> One-on-one mentorship for skills, projects, and career guidance.
                </div>
              </li>
              <li className="coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Professionals:</strong> Build expertise to scale your career and stay ahead.
                </div>
              </li>
              <li className="coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Mentors:</strong> Grow your impact with certification, programs, and resources.
                </div>
              </li>
              <li className="coaching-solutions-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <strong>Teams & Organizations:</strong> Help your team thrive with proven mentorship programs.
                </div>
              </li>
            </ul>
            <button className="coaching-solutions-cta" onClick={() => navigate('/explore')}>
              Explore Our Mentorship Options
            </button>
          </div>
          <div className="coaching-solutions-image-wrapper">
            <img src={backgroundImage} alt="Mentorship" className="coaching-solutions-image" />
            <div className="coaching-solutions-stats">
              <div className="coaching-stat-box stat-box-primary">
                <p className="coaching-stat-label">Active Mentors</p>
                <p className="coaching-stat-value">1,245+</p>
              </div>
              <div className="coaching-stat-box stat-box-secondary">
                <p className="coaching-stat-label">Mentorship Categories</p>
                <p className="coaching-stat-value">50+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mentors fade-in-up">
        <div className="section-head">
          <div className="section-head-top">
            <div>
              <h2 className="section-title white-text">Our top mentors</h2>
            </div>
            <button className="tiny view-all-btn" onClick={() => navigate('/explore')}>
              View all
            </button>
          </div>
        </div>
        <div className="mentor-slider">
          <div className="mentor-track" ref={mentorTrackRef}>
            {isLoadingMentors ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading mentors...
              </div>
            ) : mentorsToDisplay.length > 0 ? (
              mentorsToDisplay.map((mentor) => (
                <div
                  className="mentor-card-new"
                  key={mentor.id || mentor.mentor_id || mentor.name}
                  onClick={() => navigate(`/mentor/${mentor.id || mentor.mentor_id || mentor.name}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mentor-card-image-wrapper">
                    <img src={mentor.image || 'https://via.placeholder.com/400x280?text=Mentor'} alt={mentor.name} className="mentor-card-image" />
                    <button 
                      className="mentor-card-favorite"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle favorite action
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <div className="mentor-card-overlay">
                      <h3 className="mentor-card-name">{mentor.name}</h3>
                      <p className="mentor-card-location">
                        {mentor.company && (
                          <span className="mentor-card-company">
                            <span className="mentor-card-company-icon">{getCompanyIcon(mentor.company)}</span>
                            <span>{mentor.company}</span>
                          </span>
                        )}
                        {mentor.company && mentor.location && ' • '}
                        {mentor.location || (mentor.company ? '' : 'Online')}
                      </p>
                    </div>
                  </div>
                  <div className="mentor-card-content">
                    <div className="mentor-card-rating">
                      <span className="rating-stars">{renderStarsFunc(mentor.rating || 4.5)}</span>
                      <span className="rating-text">{mentor.rating || 4.5} ({mentor.reviews || 0} reviews)</span>
                    </div>
                    {mentor.assured && <span className="mentor-badge">Platform assured</span>}
                    <p className="mentor-card-description">{mentor.focus || mentor.role || mentor.bio?.substring(0, 100) || 'Experienced mentor'}</p>
                    <div className="mentor-card-footer">
                      <span className="mentor-card-price">${mentor.hourlyRate || '50'}/h</span>
                      <span className="mentor-card-free-lesson">• 1st lesson free</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No mentors available
              </div>
            )}
            <div
              className="mentor-card explore-all-card"
              onClick={() => navigate('/explore')}
              style={{ cursor: 'pointer' }}
            >
              <div className="explore-all-content">
                <h3>Explore All Mentors</h3>
                <p>Discover more mentors and find the perfect guide for your journey</p>
                <button className="primary">View All →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={howItWorksSectionRef} className="how-it-works">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">How It Works</h2>
        </div>
        <div className="how-it-works-steps">
          {howItWorksSteps.map((step) => (
            <div className="how-it-works-step step-animate" key={step.number}>
              <div className="step-number-circle">
                <span className="step-number">{step.number}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <div className="step-underline"></div>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="top-rated-programs-section fade-in-up">
        <div className="page-content-wrapper">
          <div className="top-rated-programs-header">
            <div className="top-rated-programs-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>TOP-RATED PROGRAMS</span>
            </div>
            <div className="top-rated-programs-title-row">
              <h2 className="top-rated-programs-title">Master the skills that matter most</h2>
              <button className="top-rated-programs-browse-btn" onClick={() => navigate('/explore')}>
                Browse Programs
              </button>
            </div>
          </div>
          <div className="programs-slider">
            <div className="programs-track" ref={skillsTrackRef}>
              {latestSkills.map((skill) => {
                const courseData = courses.find(c => c.id === skill.id || c.name === skill.name)
                const rating = courseData?.rating || 4.5
                const level = courseData?.level || 'Intermediate'
                const duration = courseData?.duration || 12
                const durationHours = duration * 5 // Approximate hours (assuming 5 hours per week)
                
                return (
                  <div
                    className="program-card"
                    key={skill.id || skill.name}
                    onClick={() => handleNavSearch(`course:${skill.id || skill.name}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="program-card-image-wrapper">
                      <img src={skill.image} alt={skill.name} className="program-card-image" />
                      <div className="program-card-icon-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      </div>
                    </div>
                    <div className="program-card-content">
                      <h3 className="program-card-title">{skill.name}</h3>
                      <p className="program-card-description">{skill.description?.substring(0, 100)}...</p>
                      <div className="program-card-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <span>NANODEGREE PROGRAM</span>
                      </div>
                      {rating && (
                        <div className="program-card-rating">
                          <span className="program-rating-star">★</span>
                          <span className="program-rating-value">{rating}</span>
                        </div>
                      )}
                      <div className="program-card-meta">
                        <span className="program-card-level">{level}</span>
                        <span className="program-card-separator">•</span>
                        <span className="program-card-duration">{durationHours} hours</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="career-guidance-section">
        <div className="testimonials-container">
          <div className="testimonials-left">
            <div className="testimonials-rating-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#facc15">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h2 className="testimonials-title">Not Sure What to Do Next?</h2>
            <p className="testimonials-subtext">Get personalized career advice from experienced career guiders and life advisors.</p>
            <div className="testimonials-navigation">
              <button 
                className="testimonials-nav-btn"
                onClick={() => scrollCareerGuidance('left')}
                aria-label="Scroll left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <button 
                className="testimonials-nav-btn"
                onClick={() => scrollCareerGuidance('right')}
                aria-label="Scroll right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="testimonials-right" ref={careerGuidanceRightRef}>
            <div className="testimonials-stack-container" ref={careerGuidanceTrackRef}>
              {careerGuidanceTestimonials.map((testimonial, index) => {
                const isActive = index === currentCareerGuidanceIndex
                const isPrevious = index < currentCareerGuidanceIndex
                const distance = index - currentCareerGuidanceIndex
                
                return (
                  <div 
                    key={testimonial.id} 
                    className={`testimonial-card testimonial-card-${testimonial.bgColor} ${
                      isActive ? 'testimonial-active' : 
                      isPrevious ? 'testimonial-stacked' : 
                      'testimonial-upcoming'
                    }`}
                    data-distance={distance}
                    data-index={index}
                  >
                    <div className="testimonial-header">
                      <img 
                        src={testimonial.mentorImage} 
                        alt={testimonial.mentorName}
                        className="testimonial-mentor-image"
                      />
                      <div className="testimonial-mentor-info">
                        <h3 className="testimonial-mentor-name">{testimonial.mentorName}</h3>
                        <p className="testimonial-mentor-role">{testimonial.mentorRole}</p>
                      </div>
                    </div>
                    <p className="testimonial-quote">{testimonial.quote}</p>
                    <div className="testimonial-footer">
                      <span className="testimonial-student-name">{testimonial.studentName}</span>
                      <span className="testimonial-student-rating">
                        {renderStarsFunc(testimonial.studentRating)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="student-testimonials-section fade-in-up">
        <div className="page-content-wrapper">
          <div className="student-testimonials-grid">
            <div className="student-testimonial-featured">
              <div className="student-testimonial-image-wrapper">
                <img 
                  src={studentTestimonials[0].image} 
                  alt={studentTestimonials[0].title}
                  className="student-testimonial-featured-image"
                />
                <div className="student-testimonial-overlay">
                  <span className="student-testimonial-category">{studentTestimonials[0].category}</span>
                  <h3 className="student-testimonial-featured-title">{studentTestimonials[0].title}</h3>
                  <p className="student-testimonial-featured-description">{studentTestimonials[0].description}</p>
                </div>
              </div>
            </div>
            <div className="student-testimonials-right">
              {studentTestimonials.slice(1).map((testimonial) => (
                <div key={testimonial.id} className="student-testimonial-card">
                  <div className="student-testimonial-card-image-wrapper">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.title}
                      className="student-testimonial-card-image"
                    />
                    <div className="student-testimonial-card-overlay">
                      <span className="student-testimonial-card-category">{testimonial.category}</span>
                      {testimonial.name && (
                        <div className="student-testimonial-card-header">
                          <h4 className="student-testimonial-card-name">{testimonial.name}</h4>
                          <p className="student-testimonial-card-role">{testimonial.role}</p>
                        </div>
                      )}
                      <h3 className="student-testimonial-card-title">{testimonial.title}</h3>
                      <p className="student-testimonial-card-description">{testimonial.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="page-content-wrapper">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">425k+</div>
              <div className="stat-label">MEMBERS</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">30k+</div>
              <div className="stat-label">CLASSES</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">9k+</div>
              <div className="stat-label">TEACHERS</div>
            </div>
            <div className="stat-card">
              <div className="stat-rating">
                <span className="stat-number">4.8</span>
                <div className="stat-stars">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="stat-label">APP STORE RATING</div>
            </div>
          </div>
        </div>
      </section>

      <section className="simple-testimonials-section fade-in-up">
        <div className="page-content-wrapper">
          <h2 className="simple-testimonials-title">Students Testimonials</h2>
          <div className="simple-testimonials-grid">
            {simpleTestimonials.slice((currentSimpleTestimonialPage - 1) * 3, currentSimpleTestimonialPage * 3).map((testimonial) => (
              <div key={testimonial.id} className="simple-testimonial-card">
                <img src={testimonial.avatar} alt={testimonial.name} className="simple-testimonial-avatar" />
                <div className="simple-testimonial-content">
                  <h4 className="simple-testimonial-name">{testimonial.name}</h4>
                  <p className="simple-testimonial-role">{testimonial.role} • {testimonial.company}</p>
                  <p className="simple-testimonial-quote">{testimonial.quote}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="simple-testimonials-pagination">
            <button 
              className="simple-testimonials-prev"
              onClick={() => setCurrentSimpleTestimonialPage(prev => Math.max(1, prev - 1))}
              disabled={currentSimpleTestimonialPage === 1}
              aria-label="Previous page"
            >
              ←
            </button>
            <span className="simple-testimonials-page-indicator">
              {String(currentSimpleTestimonialPage).padStart(2, '0')}/{String(Math.ceil(simpleTestimonials.length / 3)).padStart(2, '0')}
            </span>
            <button 
              className="simple-testimonials-next"
              onClick={() => setCurrentSimpleTestimonialPage(prev => Math.min(Math.ceil(simpleTestimonials.length / 3), prev + 1))}
              disabled={currentSimpleTestimonialPage === Math.ceil(simpleTestimonials.length / 3)}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </div>
      </section>

      <section className="get-in-touch-section fade-in-up">
        <div className="page-content-wrapper">
          <div className="get-in-touch-container">
            <h2 className="get-in-touch-title">Get In Touch</h2>
            <p className="get-in-touch-description">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <form className="get-in-touch-form" onSubmit={(e) => {
              e.preventDefault()
              // Handle form submission
              console.log('Email submitted:', contactEmail)
              setContactEmail('')
              alert('Thank you for your message! We\'ll get back to you soon.')
            }}>
              <div className="get-in-touch-input-wrapper">
                <input
                  type="email"
                  className="get-in-touch-input"
                  placeholder="Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <button type="submit" className="get-in-touch-submit">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer-rich">
        <div className="page-content-wrapper">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand">
                <span>Internify.</span>
              </div>
              <p className="footer-tagline">Your trusted source to find highly-vetted mentors & industry professionals to move your career ahead.</p>
              <a href="#" className="footer-contact-link">Contact</a>
              <div className="footer-social">
                <a href="#" className="social-icon" aria-label="Facebook">FB</a>
                <a href="#" className="social-icon" aria-label="Instagram">IG</a>
                <a href="#" className="social-icon" aria-label="Twitter">TW</a>
                <a href="#" className="social-icon" aria-label="LinkedIn">IN</a>
                <a href="#" className="social-icon" aria-label="YouTube">YT</a>
              </div>
            </div>
            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/explore') }}>Browse Mentors</a>
              <a href="#">Book a Session</a>
              <a href="#">Become a Mentor</a>
              <a href="#">Mentorship for Teams</a>
              <a href="#">Testimonials</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/resources') }}>Free Study Materials</a>
              <a href="#">Newsletter</a>
              <a href="#">Books</a>
              <a href="#">Perks</a>
              <a href="#">Templates</a>
              <a href="#">Career Paths</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">Case Studies</a>
              <a href="#">Partner Program</a>
              <a href="#">Code of Conduct</a>
              <a href="#">Privacy Policy</a>
              <a href="#">DMCA</a>
            </div>
            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#">Companies</a>
              <a href="#">Fractional Executives</a>
              <a href="#">Services & Training</a>
              <a href="#">Part-Time Experts</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">FAQ</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

