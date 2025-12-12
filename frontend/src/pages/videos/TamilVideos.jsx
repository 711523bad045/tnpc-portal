import React, { useState } from "react";
import { Play, User, Video } from "lucide-react";
import "./TamilVideos.css";

export default function TamilVideos() {

  // 🔥 Add state to store selected video
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { id: "EXVNgFm9wGE", title: "Tamil Grammar Basics", instructor: "Dr. Kumar", duration: "12:30" },
    { id: "B3a-f_quy1I", title: "Tamil Literature Overview", instructor: "Prof. Guru", duration: "18:40" },
    { id: "bhF5iR1rufo", title: "Tamil Speaking Practice", instructor: "Mr.Rajesh", duration: "20:15" },
    { id: "8tQoG9hsADg", title: "Tamil Script Writing", instructor: "Mr. Rajan", duration: "25:10" }
  ];

  return (
    <div className="tamil-wrapper">

      {/* HERO */}
      <div className="tamil-hero">
        <Video className="hero-icon" />
        <h1>தமிழ் Video Classes</h1>
        <p>Learn Tamil with expert instructors through high-quality lessons</p>
      </div>

      {/* CONTENT */}
      <div className="tamil-container">

        {/* 🔥 VIDEO PLAYER (appears when a card is clicked) */}
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
          <h2>Tamil Lessons</h2>
        </div>

        <div className="tamil-grid">
          {videos.map((v, i) => (
            <div
              key={i}
              className="tamil-card"
              onClick={() => setSelectedVideo(v)}  // 🔥 CLICK EVENT HERE
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
