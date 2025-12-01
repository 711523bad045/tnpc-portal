import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">TNPC Portal</h2>

      <ul className="sidebar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/daily-test">Daily Test</Link></li>
        <li><Link to="/qb">Question Bank</Link></li>
        <li><Link to="/videos">Video Classes</Link></li>
        <li><Link to="/notes">Study Notes</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
