import React from "react";

export default function EnglishVideos() {
  const videos = [
    "https://www.youtube.com/embed/VIDEO_ID_1",
    "https://www.youtube.com/embed/VIDEO_ID_2",
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">English Video Classes</h1>

      <div className="video-grid">
        {videos.map((v, i) => (
          <iframe
            key={i}
            src={v}
            className="video-frame"
            allowFullScreen
            title={`video-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
