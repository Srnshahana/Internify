import { useState, useEffect } from "react";
import supabase from "../../supabaseClient.js";
import { AnimatedGridLines } from "../../components/AnimatedGridLines";
import "../../App.css";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} style={{ color: "#fbbf24" }}>
        ★
      </span>,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" style={{ color: "#fbbf24" }}>
        ☆
      </span>,
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} style={{ color: "#d1d5db" }}>
        ★
      </span>,
    );
  }

  return stars;
};

// No hardcoded categories

function Resources({ onBack, mentors = [], onBookSession, onMentorClick }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase.from("resources").select("*");
        if (error) throw error;
        setResourcesData(data || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Get recommended mentors (first 4 mentors for display)
  const recommendedMentors = mentors.slice(0, 4);

  const handleBookSession = (mentor, e) => {
    e?.stopPropagation();
    if (onBookSession) {
      onBookSession(mentor);
    } else {
      alert(
        `Booking 1-hour doubt clarification session with ${mentor.name}...\n\nIn a real application, this would open a booking form.`,
      );
    }
  };

  const handleMentorClick = (mentor) => {
    if (onMentorClick) {
      onMentorClick(mentor);
    }
  };

  // Dynamically calculate categories strictly from the DB
  const dynamicCategories = [
    ...new Set(resourcesData.map((r) => r.category).filter(Boolean)),
  ];
  const categories = dynamicCategories.map((catId) => ({
    id: catId,
    name: catId.charAt(0).toUpperCase() + catId.slice(1),
    icon: "",
    count: resourcesData.filter((r) => r.category === catId).length,
  }));

  const currentCourses = selectedCategory
    ? resourcesData.filter((r) => r.category === selectedCategory)
    : [];
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  // Get mentors relevant to the course based on category
  const getMentorsForCourse = (course, categoryId) => {
    if (!mentors.length) return [];

    // Map category to relevant skills
    const categorySkillMap = {
      programming: [
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "Python",
        "Full-stack",
        "Backend",
        "Frontend",
      ],
      design: [
        "UI/UX Design",
        "Figma",
        "Design Systems",
        "User Research",
        "Prototyping",
      ],
      data: [
        "Python",
        "Data Science",
        "Machine Learning",
        "SQL",
        "Analytics",
        "Statistics",
      ],
      marketing: [
        "Digital Marketing",
        "SEO",
        "Content Strategy",
        "Growth",
        "Marketing",
      ],
      business: ["Product Management", "Business", "Strategy", "Management"],
      ai: [
        "Machine Learning",
        "AI",
        "Python",
        "Data Science",
        "Neural Networks",
      ],
    };

    const relevantSkills = categorySkillMap[categoryId] || [];

    // Filter mentors whose skills match the category
    const relevantMentors = mentors.filter((mentor) =>
      mentor.skills?.some((skill) =>
        relevantSkills.some(
          (catSkill) =>
            skill.toLowerCase().includes(catSkill.toLowerCase()) ||
            catSkill.toLowerCase().includes(skill.toLowerCase()),
        ),
      ),
    );

    // Return top 4 relevant mentors, or fallback to first 4 if none match
    return relevantMentors.length > 0
      ? relevantMentors.slice(0, 4)
      : mentors.slice(0, 4);
  };

  const handleDownload = (material) => {
    // In a real app, this would download the file
    console.log("Downloading:", material.name);
    // For demo, we can open in new tab or trigger download
    if (material.url && material.url !== "#") {
      window.open(material.url, "_blank");
    } else {
      alert(
        `Downloading ${material.name}...\n\nIn a real application, this would download the PDF file.`,
      );
    }
  };

  if (loading) {
    return (
      <div
        className="resources-page-container font-sans"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <p style={{ fontSize: "1.25rem", color: "#64748b", fontWeight: 500 }}>
          Loading resources...
        </p>
      </div>
    );
  }

  if (selectedCourse) {
    const course = resourcesData.find((c) => c.id === selectedCourse);
    if (!course) {
      setSelectedCourse(null);
      return null;
    }

    // Get relevant mentors for this course
    const courseMentors = getMentorsForCourse(course, selectedCategory);

    return (
      <div
        className="resources-page-container font-sans"
        style={{ position: "relative" }}
      >
        <AnimatedGridLines />
        <button
          className="back-button"
          onClick={() => setSelectedCourse(null)}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            zIndex: 100,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "80px",
            paddingBottom: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            className="stitch-hero-content"
            style={{ zIndex: 10, textAlign: "center", maxWidth: "800px" }}
          >
            <span
              className="feature-label"
              style={{ marginBottom: "1rem", display: "inline-block" }}
            >
              FREE STUDY MATERIALS
            </span>
            <h1
              className="stitch-hero-heading"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              {course.title}
            </h1>
            <p className="stitch-hero-subheading" style={{ marginTop: "1rem" }}>
              {course.description}
            </p>
          </div>
        </div>

        <div
          className="resources-content"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}
        >
          <div className="materials-section">
            <h2 className="section-title">Study Materials</h2>
            <p className="section-subtitle">
              Download free PDF study materials for this course
            </p>

            <div className="materials-list">
              <div className="resource-material-item">
                <div className="resource-material-icon-box">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div className="material-info" style={{ flexGrow: 1 }}>
                  <h3
                    className="material-name"
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "#0f172a",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {course.title} Document
                  </h3>
                  <div
                    className="material-meta"
                    style={{
                      display: "flex",
                      gap: "1rem",
                      color: "#64748b",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span className="resource-type-badge">PDF</span>
                  </div>
                </div>
                {course.pdf_url ? (
                  <button
                    className="resource-download-btn"
                    onClick={() => window.open(course.pdf_url, "_blank")}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                  </button>
                ) : (
                  <div
                    style={{
                      color: "#94a3b8",
                      fontWeight: 500,
                      fontSize: "1rem",
                      padding: "0.5rem 1rem",
                      background: "#f1f5f9",
                      borderRadius: "8px",
                    }}
                  >
                    null
                  </div>
                )}
              </div>
            </div>

            {/* Scroll Indicator for Mentor Recommendations */}
            {courseMentors.length > 0 && (
              <div className="scroll-indicator-mentors">
                <div className="scroll-indicator-content">
                  <p className="scroll-indicator-text">
                    Need help? Get mentor recommendations below
                  </p>
                  <div className="scroll-indicator-arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="resources-sidebar">
            <div className="info-card">
              <h3>About Free Resources</h3>
              <p>
                These study materials are provided free of charge to help you
                learn and grow. Download and use them for your personal learning
                journey.
              </p>
            </div>
            <div className="info-card">
              <h3>Want More?</h3>
              <p>
                Enroll in our full courses to get access to live sessions,
                assignments, mentor feedback, and certificates.
              </p>
              <button className="primary" onClick={onBack}>
                Explore Courses
              </button>
            </div>
          </div>
        </div>

        {/* Mentor Recommendations for Course */}
        {courseMentors.length > 0 && (
          <section
            className="course-mentor-recommendations"
            style={{
              position: "relative",
              zIndex: 10,
              background: "#f8fafc",
              padding: "6rem 4%",
              marginTop: "4rem",
              borderTop: "1px solid rgba(15,23,42,0.05)",
            }}
          >
            <div style={{ width: "100%", margin: "0 auto" }}>
              <div
                className="course-mentor-recommendations-header"
                style={{ marginBottom: "3rem", textAlign: "center" }}
              >
                <div>
                  <p
                    className="eyebrow"
                    style={{
                      color: "#475569",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Need Help with This Course?
                  </p>
                  <h2
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    Get Doubt Clarification
                  </h2>
                  <p
                    className="lead"
                    style={{
                      fontSize: "1.125rem",
                      color: "#64748b",
                      maxWidth: "600px",
                      margin: "0 auto",
                    }}
                  >
                    Book a 1-hour session with experienced mentors who
                    specialize in {currentCategory?.name.toLowerCase()} to
                    clarify your doubts and get personalized guidance.
                  </p>
                </div>
              </div>

              <div className="mentor-horizontal-scroll">
                {courseMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="resource-glass-card"
                    onClick={() => handleMentorClick(mentor)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      padding: "2rem",
                    }}
                  >
                    <div className="card-dot-grid"></div>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          marginBottom: "1.5rem",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "16px",
                            objectFit: "cover",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                          }}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            className="mentor-meta"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            <span
                              style={{
                                background: "#eff6ff",
                                color: "#3b82f6",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {mentor.company}
                            </span>
                            {mentor.assured && (
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "18px", color: "#3b82f6" }}
                              >
                                verified
                              </span>
                            )}
                          </div>
                          <h3
                            style={{
                              margin: "0 0 0.25rem 0",
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color: "#475569",
                            }}
                          >
                            {mentor.name}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              color: "#64748b",
                              fontSize: "0.875rem",
                            }}
                          >
                            {mentor.role}
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "auto",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          borderTop: "1px solid rgba(15, 23, 42, 0.05)",
                          paddingTop: "1.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            <span style={{ display: "flex", gap: "2px" }}>
                              {renderStars(mentor.rating)}
                            </span>
                            <span style={{ fontWeight: 600, color: "#0f172a" }}>
                              {mentor.rating}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "0.2rem",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: 700,
                                color: "#0f172a",
                              }}
                            >
                              ₹{mentor.hourlyRate || 75}
                            </span>
                            <span
                              style={{ fontSize: "0.875rem", color: "#64748b" }}
                            >
                              / hr
                            </span>
                          </div>
                        </div>
                        <button
                          className="book-session-btn"
                          style={{ width: "100%", justifyContent: "center" }}
                          onClick={(e) => handleBookSession(mentor, e)}
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div
        className="resources-page-container font-sans"
        style={{ position: "relative" }}
      >
        <AnimatedGridLines />
        <button
          className="back-button"
          onClick={() => setSelectedCategory(null)}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            zIndex: 100,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          ← Back to Categories
        </button>

        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "80px",
            paddingBottom: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            className="stitch-hero-content"
            style={{ zIndex: 10, textAlign: "center", maxWidth: "800px" }}
          >
            <span
              className="feature-label"
              style={{ marginBottom: "1rem", display: "inline-block" }}
            >
              FREE RESOURCES
            </span>
            <h1
              className="stitch-hero-heading"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {currentCategory?.name} Resources
            </h1>
            <p className="stitch-hero-subheading" style={{ marginTop: "1rem" }}>
              Browse free study materials for{" "}
              {currentCategory?.name.toLowerCase()} courses
            </p>
          </div>
        </div>

        <div className="resources-courses-grid resources-responsive-grid" style={{ padding: '4rem 4%', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          {currentCourses.length > 0 ? (
            currentCourses.map((course) => (
              <div
                key={course.id}
                className="resource-glass-card"
                onClick={() => {
                  if (course.pdf_url) {
                    window.open(course.pdf_url, '_blank');
                  }
                }}
                style={{ padding: '2rem', cursor: course.pdf_url ? 'pointer' : 'default', minHeight: '240px' }}
              >
                <div className="card-dot-grid"></div>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="feature-title" style={{ color: '#020617', margin: 0, fontSize: '1.5rem', paddingRight: '1rem', fontWeight: 700, lineHeight: 1.3 }}>{course.title}</h3>
                  </div>
                  <p className="handwriting-font" style={{ color: '#475569', marginBottom: '1.5rem', flexGrow: 1 }}>{course.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(15, 23, 42, 0.05)', paddingTop: '1.25rem' }}>
                    {course.pdf_url ? (
                      <button
                        className="resource-download-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(course.pdf_url, '_blank');
                        }}
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download PDF
                      </button>
                    ) : (
                      <div style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '8px', width: '100%', textAlign: 'center' }}>
                        Doc not available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No resources available for this category yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="resources-page-container font-sans"
      style={{ position: "relative" }}
    >
      <AnimatedGridLines />
      <button
        className="back-button"
        onClick={onBack}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          zIndex: 100,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
          paddingBottom: "60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          className="stitch-hero-content"
          style={{ zIndex: 10, textAlign: "center", maxWidth: "800px" }}
        >
          <span
            className="feature-label"
            style={{ marginBottom: "1rem", display: "inline-block" }}
          >
            FREE LEARNING RESOURCES
          </span>
          <h1
            className="stitch-hero-heading"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            Study Materials Library
          </h1>
          <p className="stitch-hero-subheading" style={{ marginTop: "1rem" }}>
            Access free PDF study materials for various courses. Download and
            learn at your own pace.
          </p>
        </div>
      </div>

      <div
        className="resources-categories-grid resources-responsive-grid"
        style={{
          padding: "4rem 4%",
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        {categories.map((category) => {
          const categoryResources = resourcesData.filter(
            (r) => r.category === category.id,
          );
          return (
            <div
              key={category.id}
              className="resource-glass-card"
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: "3rem 2rem",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "260px",
                cursor: "pointer",
                flexDirection: "column",
                display: "flex",
              }}
            >
              <div className="card-dot-grid"></div>
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <h3
                  className="feature-title"
                  style={{
                    color: "#020617",
                    margin: "0 0 0.5rem 0",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  {category.name}
                </h3>
                <p
                  className="handwriting-font"
                  style={{
                    margin: "0 0 1rem 0",
                    textAlign: "center",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {category.count} courses available
                </p>

                {categoryResources.length > 0 && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    {categoryResources.slice(0, 3).map((resource) => (
                      <span
                        key={resource.id}
                        style={{
                          fontSize: "0.875rem",
                          color: "#475569",
                          background: "rgba(15, 23, 42, 0.03)",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "12px",
                          textAlign: "center",
                          width: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {resource.title}
                      </span>
                    ))}
                    {categoryResources.length > 3 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        +{categoryResources.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div
                  className="category-arrow"
                  style={{
                    color: "#3b82f6",
                    marginTop: "1.5rem",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mentor Recommendations Section */}
      {recommendedMentors.length > 0 && (
        <section
          className="mentor-recommendations-section"
          style={{
            position: "relative",
            zIndex: 10,
            background: "#f8fafc",
            padding: "6rem 4%",
            marginTop: "4rem",
            borderTop: "1px solid rgba(15,23,42,0.05)",
          }}
        >
          <div style={{ width: "100%", margin: "0 auto" }}>
            <div
              className="mentor-recommendations-header"
              style={{ marginBottom: "3rem", textAlign: "center" }}
            >
              <div>
                <p
                  className="eyebrow"
                  style={{
                    color: "#475569",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Need Help?
                </p>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Get Doubt Clarification
                </h2>
                <p
                  className="lead"
                  style={{
                    fontSize: "1.125rem",
                    color: "#64748b",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Book a 1-hour session with expert mentors to clarify your
                  doubts and get personalized guidance.
                </p>
              </div>
            </div>

            <div className="mentor-horizontal-scroll">
              {recommendedMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="resource-glass-card"
                  onClick={() => handleMentorClick(mentor)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    padding: "2rem",
                  }}
                >
                  <div className="card-dot-grid"></div>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 10,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        marginBottom: "1.5rem",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "16px",
                          objectFit: "cover",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                          className="mentor-meta"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              background: "#eff6ff",
                              color: "#3b82f6",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {mentor.company}
                          </span>
                          {mentor.assured && (
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "18px", color: "#3b82f6" }}
                            >
                              verified
                            </span>
                          )}
                        </div>
                        <h3
                          style={{
                            margin: "0 0 0.25rem 0",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#475569",
                          }}
                        >
                          {mentor.name}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "0.875rem",
                          }}
                        >
                          {mentor.role}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        borderTop: "1px solid rgba(15, 23, 42, 0.05)",
                        paddingTop: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span style={{ display: "flex", gap: "2px" }}>
                            {renderStars(mentor.rating)}
                          </span>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>
                            {mentor.rating}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.2rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            ₹{mentor.hourlyRate || 75}
                          </span>
                          <span
                            style={{ fontSize: "0.875rem", color: "#64748b" }}
                          >
                            / hr
                          </span>
                        </div>
                      </div>
                      <button
                        className="book-session-btn"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={(e) => handleBookSession(mentor, e)}
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mentor-recommendations-footer">
            <p>
              Need help choosing a mentor?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onBack?.();
                }}
              >
                Browse all mentors
              </a>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default Resources;
