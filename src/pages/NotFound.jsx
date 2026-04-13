import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveGrid } from './Landing/LandingPage';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container" style={{
            minHeight: '100vh',
            background: '#eef5ff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            <InteractiveGrid />

            {/* Content Card */}
            <div className="not-found-card" style={{
                position: 'relative',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '4rem',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                maxWidth: '500px'
            }}>
                <h1 style={{
                    fontSize: '8rem',
                    fontWeight: 800,
                    margin: 0,
                    background: 'linear-gradient(135deg, #0f172a 0%, #2356c6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1
                }}>404</h1>
                
                <h2 style={{
                    fontSize: '1.5rem',
                    color: '#0f172a',
                    marginTop: '1rem',
                    fontWeight: 700
                }}>Page Not Found</h2>
                
                <p style={{
                    color: '#475569',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    marginTop: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    The page you're looking for doesn't exist or has been moved to a new destination.
                </p>

                <button 
                    onClick={() => navigate('/')}
                    style={{
                        background: '#0f172a',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2.5rem',
                        borderRadius: '100px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.background = '#2356c6';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = '#0f172a';
                    }}
                >
                    Back to Home
                </button>
            </div>

            {/* Decorative Blobs */}
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(35, 86, 198, 0.05) 0%, transparent 70%)',
                top: '-10%',
                right: '-5%',
                zIndex: 1
            }}></div>
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(35, 86, 198, 0.05) 0%, transparent 70%)',
                bottom: '-10%',
                left: '-5%',
                zIndex: 1
            }}></div>
        </div>
    );
};

export default NotFound;
