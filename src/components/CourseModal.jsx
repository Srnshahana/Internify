import React from 'react';

const CourseModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const careerFields = [
        {
            title: "Software Development",
            icon: "code",
            courses: [
                { name: "Full Stack Web Development", duration: "12 Weeks", tag: "Hot" },
                { name: "Mobile App Development (React Native)", duration: "10 Weeks", tag: "Trending" },
                { name: "Python for Data Science", duration: "8 Weeks", tag: "Best Seller" },
                { name: "Backend Architecture with Node.js", duration: "10 Weeks", tag: "New" }
            ]
        },
        {
            title: "Design & Creative",
            icon: "palette",
            courses: [
                { name: "UI/UX Design Masterclass", duration: "8 Weeks", tag: "Popular" },
                { name: "Graphic Design Fundamentals", duration: "6 Weeks", tag: "Featured" },
                { name: "Motion Graphics with After Effects", duration: "10 Weeks", tag: "Advanced" }
            ]
        },
        {
            title: "Business & Management",
            icon: "business_center",
            courses: [
                { name: "Digital Marketing Strategy", duration: "8 Weeks", tag: "Hot" },
                { name: "Product Management Essentials", duration: "10 Weeks", tag: "Best Seller" },
                { name: "Business Analytics", duration: "12 Weeks", tag: "New" }
            ]
        }
    ];

    return (
        <div className="course-modal-overlay" onClick={onClose}>
            <div className="course-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="course-modal-header">
                    <div>
                        <h2 className="course-modal-title">Explore Our Programs</h2>
                        <p className="course-modal-subtitle">Find the perfect path to elevate your career</p>
                    </div>
                    <button className="course-modal-close" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="course-modal-body">
                    {careerFields.map((field, idx) => (
                        <div key={idx} className="career-field-section">
                            <div className="field-header">
                                <span className="material-symbols-outlined field-icon">{field.icon}</span>
                                <h3 className="field-title">{field.title}</h3>
                            </div>
                            <div className="course-grid-modal">
                                {field.courses.map((course, cIdx) => (
                                    <div key={cIdx} className="course-item-modal">
                                        <div className="course-item-info">
                                            <span className="course-item-name">{course.name}</span>
                                            <span className="course-item-duration">{course.duration}</span>
                                        </div>
                                        {course.tag && <span className={`course-item-tag ${course.tag.toLowerCase().replace(' ', '-')}`}>{course.tag}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="course-modal-footer">
                    <p>Don't see what you're looking for? <button className="modal-link-btn">Talk to an advisor</button></p>
                </div>
            </div>
        </div>
    );
};

export default CourseModal;
