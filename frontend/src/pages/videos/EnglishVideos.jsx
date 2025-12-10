import React, { useState } from "react";
import { Play, User, Video } from "lucide-react";
import "./EnglishVideos.css";

export default function EnglishVideos() {

  // 🔥 Add selected video state
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { id: "sCiG6rlk2Bc", title: "English Grammar Basics", instructor: "Mr. John", duration: "10:30" },
    { id: "V4HBExvlWD4", title: "English Literature Overview", instructor: "Mrs. Smith", duration: "15:40" },
    { id: "Hz9YaH0zJGQ", title: "Spoken English Practice", instructor: "Ms. Clara", duration: "18:20" },
    { id: "jTEATmzxdro", title: "English Writing Skills", instructor: "Mr. David", duration: "22:15" }
  ];

  return (
    <div className="tamil-wrapper">

      {/* HERO */}
      <div className="tamil-hero">
        <Video className="hero-icon" />
        <h1>English Video Classes</h1>
        <p>Learn English through structured video lessons from expert instructors</p>
      </div>

      {/* CONTENT */}
      <div className="tamil-container">

        {/* 🔥 VIDEO PLAYER (appears when clicked) */}
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
          <h2>English Lessons</h2>
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
