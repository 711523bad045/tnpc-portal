import "./SuccessAnimation.css";

function SuccessAnimation({ title }) {
  return (
    <div className="success-overlay">
      <div className="success-box">
        <div className="checkmark-circle">
          <div className="checkmark"></div>
        </div>
        <h2>{title}</h2>
        <p>Please check your email to continue</p>
      </div>
    </div>
  );
}

export default SuccessAnimation;
