import React from "react";

export default function MathsVideos() {
  const videos = [
    "https://www.youtube.com/embed/VIDEO_ID_1",
    "https://www.youtube.com/embed/VIDEO_ID_2",
    "https://www.youtube.com/embed/VIDEO_ID_3",
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Maths Video Classes</h1>

      <div className="video-grid">
        {videos.map((v, i) => (
          <iframe
            key={i}
            src={v}
            className="video-frame"
            allowFullScreen
            title={`maths-video-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
