import React from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  {
    title: "தமிழ்",
    subtitle: "Watch Tamil Classes",
    route: "/videos/tamil",
  },
  {
    title: "English",
    subtitle: "Watch English Classes",
    route: "/videos/english",
  },
  {
    title: "Maths",
    subtitle: "Watch Maths Classes",
    route: "/videos/maths",
  },
  {
    title: "Social",
    subtitle: "Watch Social Classes",
    route: "/videos/social",
  },
];

export default function VideoClasses() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">🎥 Video Classes</h1>

      <div className="cards-grid">
        {subjects.map((s, i) => (
          <div
            key={i}
            className="subject-card"
            onClick={() => navigate(s.route)}
          >
            <h2>{s.title}</h2>
            <p>{s.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
