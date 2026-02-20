import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'

const StudentAppBar = ({ onLogout, userImage, isTransparent, hideLogout, hideProfile }) => {
    return (
        <nav className={`elegant-navbar ${isTransparent ? 'transparent-navbar' : ''}`}>
            {!hideProfile && (
                <div className="user-profile-left">
                    <img
                        src={userImage || "https://ui-avatars.com/api/?name=User&background=0D0D0D&color=fff"}
                        alt="User Profile"
                    />
                </div>
            )}
            {!hideLogout && (
                <div className="nav-actions-right">
                    <button className="login-btn-elegant" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}

export default StudentAppBar
