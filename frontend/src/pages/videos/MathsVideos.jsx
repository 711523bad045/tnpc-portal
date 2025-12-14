import React, { useState } from "react";
import { Play, User, Video, ArrowLeft } from "lucide-react";
import "./MathsVideos.css";

export default function MathVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { id: "NybHckSEQBI", title: "Basic Algebra Concepts", instructor: "Mr. Allen", duration: "14:20" },
    { id: "302eJ3TzJQU", title: "Geometry Fundamentals", instructor: "Ms. Grace", duration: "16:45" },
    { id: "IydbTBZJy7w", title: "Trigonometry Made Easy", instructor: "Mr. Stephen", duration: "19:10" },
    { id: "8idr1WZ1A7Q", title: "Statistics & Probability Basics", instructor: "Mrs. Diana", duration: "23:05" }
  ];

  const handleBack = () => {
    if (selectedVideo) {
      setSelectedVideo(null);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="tamil-wrapper">

      {/* HERO */}
      <div className="tamil-hero">
        <Video className="hero-icon" />
        <h1>Math Video Classes</h1>
        <p>Understand Mathematics with clear step-by-step video explanations.</p>
      </div>

      <div className="tamil-container">

        {/* VIDEO PLAYER */}
        {selectedVideo && (
          <div className="video-player-box">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id}`}
              className="video-player"
              title={selectedVideo.title}
              allowFullScreen
            />
          </div>
        )}

        <div className="section-header">
          <Play size={22} />
          <h2>Math Lessons</h2>
        </div>

        <div className="tamil-grid">
          {videos.map((v, i) => (
            <div
              key={i}
              className="tamil-card"
              onClick={() => setSelectedVideo(v)}
            >
              <div className="thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                  alt={v.title}
                />
                <span className="duration">{v.duration}</span>
              </div>

              <div className="info">
                <h3>{v.title}</h3>
                <p className="inst">
                  <User size={14} />
                  {v.instructor}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ✅ SIMPLE BACK BUTTON – BOTTOM LEFT */}
      <button className="bottom-back-btn" onClick={handleBack}>
        <ArrowLeft size={16} />
        Back
      </button>

    </div>
  );
}
