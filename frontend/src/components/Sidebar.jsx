import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  ClipboardList,
  FileQuestion,
  Video,
  BookOpen,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">TNPC Portal</div>

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

        <NavLink to="/study-notes" className="menu-item">
          <BookOpen size={18} /> <span>Study Notes</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/logout" className="menu-item logout">
          <LogOut size={18} /> <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
