import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  {
    title: "தமிழ்",
    subtitle: "Tamil Mastery",
    route: "/videos/tamil",
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #C06C84 50%, #F67280 100%)",
    particles: "🌸",
    stats: { videos: 156, hours: "24h", students: "2.4K" }
  },
  {
    title: "English",
    subtitle: "Global Communication",
    route: "/videos/english",
    gradient: "linear-gradient(135deg, #4158D0 0%, #C850C0 50%, #FFCC70 100%)",
    particles: "✨",
    stats: { videos: 203, hours: "32h", students: "3.8K" }
  },
  {
    title: "Maths",
    subtitle: "Logical Thinking",
    route: "/videos/maths",
    gradient: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 50%, #2BFF88 100%)",
    particles: "🔮",
    stats: { videos: 287, hours: "41h", students: "4.2K" }
  },
  {
    title: "Social",
    subtitle: "World Knowledge",
    route: "/videos/social",
    gradient: "linear-gradient(135deg, #F857A6 0%, #FF5858 50%, #FFB347 100%)",
    particles: "🌟",
    stats: { videos: 178, hours: "28h", students: "2.9K" }
  }
];

export default function VideoClasses() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;900&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.7; }
        }

        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(255,255,255,0.6)); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .premium-container {
          min-height: 100vh;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
        }

        .mesh-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 10% 20%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(30, 144, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 20, 147, 0.1) 0%, transparent 50%);
          animation: gradient-shift 15s ease infinite;
          background-size: 200% 200%;
        }

        .stars {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 85%, white, transparent);
          background-size: 200% 200%;
          animation: gradient-shift 20s ease infinite;
          opacity: 0.3;
        }

        .spotlight {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, transparent 70%);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .content-main {
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 5rem;
          animation: slide-up 1s ease;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          text-transform: uppercase;
          display: none;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: -4px;
          line-height: 1.1;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .hero-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 300;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          padding: 2rem 0;
        }

        .premium-card {
          position: relative;
          background: rgba(20, 20, 30, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slide-up 1s ease;
          animation-fill-mode: both;
        }

        .premium-card:nth-child(1) { animation-delay: 0.1s; }
        .premium-card:nth-child(2) { animation-delay: 0.2s; }
        .premium-card:nth-child(3) { animation-delay: 0.3s; }
        .premium-card:nth-child(4) { animation-delay: 0.4s; }

        .premium-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 2rem;
          padding: 2px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .premium-card:hover::before {
          opacity: 1;
        }

        .premium-card:hover {
          transform: translateY(-20px) scale(1.03);
          box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .card-header {
          height: 200px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.5s ease;
        }

        .premium-card:hover .card-header {
          height: 240px;
        }

        .header-gradient {
          position: absolute;
          inset: 0;
          opacity: 0.9;
          transition: all 0.5s ease;
        }

        .premium-card:hover .header-gradient {
          opacity: 1;
          transform: scale(1.1);
        }

        .floating-particles {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .particle {
          position: absolute;
          font-size: 2rem;
          animation: float-particle 4s ease-in-out infinite;
          opacity: 0.3;
        }

        .particle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
        .particle:nth-child(2) { top: 60%; right: 30%; animation-delay: 1s; }
        .particle:nth-child(3) { bottom: 30%; left: 40%; animation-delay: 2s; }

        .card-icon {
          font-size: 5rem;
          position: relative;
          z-index: 2;
          transition: all 0.5s ease;
          filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
        }

        .premium-card:hover .card-icon {
          transform: scale(1.2) rotateY(15deg);
          filter: drop-shadow(0 20px 50px rgba(0,0,0,0.7));
        }

        .card-body {
          padding: 2rem;
          position: relative;
          z-index: 2;
        }

        .card-title {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }

        .card-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .card-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-box {
          text-align: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.875rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .premium-card:hover .stat-box {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-5px);
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          display: block;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .premium-button {
          width: 100%;
          padding: 1rem;
          background: white;
          color: #000;
          border: none;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
        }

        .premium-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(30, 144, 255, 0.2));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .premium-button:hover::before {
          opacity: 1;
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(255, 255, 255, 0.3);
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        .button-arrow {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .premium-button:hover .button-arrow {
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .premium-container {
            padding: 2rem 1rem;
          }

          .hero-title {
            font-size: 3rem;
            letter-spacing: -2px;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .card-title {
            font-size: 2rem;
          }

          .card-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="premium-container">
        <div className="mesh-gradient"></div>
        <div className="stars"></div>
        <div 
          className="spotlight" 
          style={{
            left: mousePos.x - 300,
            top: mousePos.y - 300
          }}
        ></div>

        <div className="content-main">
          <div className="hero-section">
            <h1 className="hero-title">Video Classes</h1>
            <p className="hero-description">
              Immersive learning experiences crafted by expert educators
            </p>
          </div>

          <div className="cards-grid">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="premium-card"
                onClick={() => navigate(subject.route)}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="card-header">
                  <div 
                    className="header-gradient" 
                    style={{ background: subject.gradient }}
                  ></div>
                  
                  <div className="floating-particles">
                    <span className="particle">{subject.particles}</span>
                    <span className="particle">{subject.particles}</span>
                    <span className="particle">{subject.particles}</span>
                  </div>

                  <div className="card-icon">
                    {index === 0 && '🌺'}
                    {index === 1 && '📚'}
                    {index === 2 && '🔢'}
                    {index === 3 && '🌍'}
                  </div>
                </div>

                <div className="card-body">
                  <h2 className="card-title">{subject.title}</h2>
                  <p className="card-subtitle">{subject.subtitle}</p>

                  <div className="card-stats">
                    <div className="stat-box">
                      <span className="stat-value">{subject.stats.videos}</span>
                      <span className="stat-label">Videos</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-value">{subject.stats.hours}</span>
                      <span className="stat-label">Duration</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-value">{subject.stats.students}</span>
                      <span className="stat-label">Students</span>
                    </div>
                  </div>

                  <button className="premium-button">
                    <span className="button-text">Begin Journey</span>
                    <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}