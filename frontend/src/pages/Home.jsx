import { Link } from "react-router-dom";
import "./Home.css";

import logo from "../assets/tnpc-logo.png";
import building from "../assets/tnpsc-building-ai.png";

function Home() {
  const scrollToContact = () => {
    const footer = document.getElementById("contact-section");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-bg">

      {/* Navbar */}
      <nav className="navbar fade-down">
        <div className="nav-left">
          <img src={logo} className="logo" alt="TNPSC Logo" />

          <div className="title-block">
            <h2 className="site-title">TNPSC GROUP 4 - STUDY PORTAL</h2>
            <p className="subtitle">100 Days Study Plan to Pass Group 4</p>
          </div>
        </div>

        <button className="contact-btn" onClick={scrollToContact}>
          Contact Us
        </button>
      </nav>

      {/* Hero Section */}
      <div className="hero-container fade-up">
        <div className="hero-text">
          <h1 className="hero-title">
            Education choice <br /> transparent, <br /> globally
          </h1>

          <p className="hero-subtitle">
            TNPSC exam preparation made simple. Learn, practice, and grow.
          </p>

          <div className="btn-group">
            <Link to="/register" className="btn-dark">Create Account</Link>
            <Link to="/login" className="btn-light">Login</Link>
          </div>
        </div>

        <div className="hero-image-container fade-right">
          <img src={building} alt="TNPSC Building" className="hero-image" />
        </div>
      </div>

      {/* Footer */}
      <footer id="contact-section" className="footer fade-up">
        <p className="footer-title">TNPSC Group 4 Study Portal</p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:nrajesh04321@gmail.com">nrajesh04321@gmail.com</a>
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:9751247267">+91 9751247267</a>
        </p>

        <p className="copy">© 2025 TNPSC Study Portal - All Rights Reserved</p>
      </footer>

    </div>
  );
}

export default Home;
