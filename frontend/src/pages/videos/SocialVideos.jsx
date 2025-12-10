import React, { useState } from "react";
import { Play, User, Video } from "lucide-react";
import "./SocialVideos.css";

export default function SocialVideos() {

  // 🔥 state to store selected video
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { id: "z393ex0DQq4", title: "Introduction to Civics", instructor: "Mrs. Latha", duration: "13:10" },
    { id: "1uWI0h2QYh4", title: "World Geography Basics", instructor: "Mr. Rajesh", duration: "17:25" },
    { id: "wX6J0Gd2EC8", title: "History of Ancient Civilizations", instructor: "Dr. Meera", duration: "20:40" },
    { id: "dVTNmSmUo14", title: "Economics for Beginners", instructor: "Mr. Thomas", duration: "22:15" }
  ];

  return (
    <div className="tamil-wrapper">

      {/* HERO */}
      <div className="tamil-hero">
        <Video className="hero-icon" />
        <h1>Social Science Video Classes</h1>
        <p>Learn History, Geography, Civics & Economics through simple explanations</p>
      </div>

      {/* CONTENT */}
      <div className="tamil-container">

        {/* 🔥 VIDEO PLAYER (plays when card is clicked) */}
        {selectedVideo && (
          <div className="video-player-box">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id}`}
              className="video-player"
              allowFullScreen
              title={selectedVideo.title}
            />
          </div>
        )}

        <div className="section-header">
          <Play size={22} />
          <h2>Social Science Lessons</h2>
        </div>

        <div className="tamil-grid">
          {videos.map((v, i) => (
            <div
              key={i}
              className="tamil-card"
              onClick={() => setSelectedVideo(v)} // 🔥 CLICK TO PLAY
            >
              <div className="thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                  alt={v.title}
                  onError={(e) => (e.target.style.display = "none")}
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
    </div>
  );
}
