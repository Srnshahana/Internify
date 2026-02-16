import Lottie from 'lottie-react'
import loadingJson from '../assets/lottie/loading.json'

const Loading = ({ fullScreen = false, size = "150px" }) => {
    const containerStyle = fullScreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999
    } : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '2rem 0'
    }

    return (
        <div className="loading-container" style={containerStyle}>
            <div style={{ width: size, height: size }}>
                <Lottie animationData={loadingJson} loop={true} />
            </div>
        </div>
    )
}

export default Loading
