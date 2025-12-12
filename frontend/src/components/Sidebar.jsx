import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  ClipboardList,
  FileQuestion,
  Video,
  User,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">TNPSC Portal</div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="menu-item">
          <Home size={18} /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/daily-test" className="menu-item">
          <ClipboardList size={18} /> <span>Daily Test</span>
        </NavLink>

        <NavLink to="/question-bank" className="menu-item">
          <FileQuestion size={18} /> <span>Question Bank</span>
        </NavLink>

        <NavLink to="/video-classes" className="menu-item">
          <Video size={18} /> <span>Video Classes</span>
        </NavLink>

        <NavLink to="/account" className="menu-item">
        <User size={18} /> <span>Account</span>
       </NavLink>

      </nav>

      <div className="menu-item logout"onClick={() => {localStorage.removeItem("token"); window.location.replace("/login"); }}>
            <LogOut size={18} /> <span>Logout</span>
          </div>
    </div>
  );
}

export default Sidebar;
