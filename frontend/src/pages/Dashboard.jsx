import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStudyTimer } from "../context/StudyTimerContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Clock, TrendingUp, Calendar, Award } from "lucide-react";
import "./Dashboard.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Dashboard() {
  const { secondsToday, isLoaded } = useStudyTimer(); 
  const [weeklyData, setWeeklyData] = useState(
    DAYS.map((d) => ({ day: d, minutes: 0 }))
  );
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const API = import.meta.env.VITE_API_URL; // <-- IMPORTANT

  const totalWeekMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const avgDaily = (totalWeekMinutes / 7).toFixed(0);
  const todayMinutes = (secondsToday / 60).toFixed(0);

  useEffect(() => {
    loadWeeklyData();
    loadMonthlyData();
    loadStreak();
  }, []);

  useEffect(() => {
    if (secondsToday > 0 && secondsToday % 60 === 0) {
      loadWeeklyData();
      loadMonthlyData();
      loadStreak();
    }
  }, [secondsToday]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadWeeklyData = async () => {
    try {
      const res = await axios.get(`${API}/study/weekly`, {
        headers: getAuthHeader(),
      });
      setWeeklyData(res.data || DAYS.map((d) => ({ day: d, minutes: 0 })));
    } catch (err) {
      console.error("❌ Load weekly error:", err);
    }
  };

  const loadMonthlyData = async () => {
    try {
      const res = await axios.get(`${API}/study/monthly`, {
        headers: getAuthHeader(),
      });
      setMonthlyTotal(res.data?.total || 0);
    } catch (err) {
      console.error("❌ Load monthly error:", err);
    }
  };

  const loadStreak = async () => {
    try {
      const res = await axios.get(`${API}/study/streak`, {
        headers: getAuthHeader(),
      });
      setStreak(res.data?.streak || 0);
    } catch (err) {
      console.error("❌ Load streak error:", err);
    }
  };

  const formatTime = (sec) => {
    sec = Math.round(sec);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getBarColor = (minutes) => {
    if (minutes >= 90) return "#10b981";
    if (minutes >= 60) return "#3b82f6";
    if (minutes >= 30) return "#f59e0b";
    return "#ef4444";
  };

  if (!isLoaded) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ----- HEADER ----- */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Study Dashboard</h1>
          <p className="dashboard-subtitle">Track your learning journey 🚀</p>
        </div>

        <div className="streak-badge">
          <Award size={24} color="#f59e0b" />
          <div className="streak-info">
            <div className="streak-number">{streak}</div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>
      </div>

      {/* ----- STATS ----- */}
      <div className="stats-grid">
        <div className="stat-card gradient-blue">
          <div className="card-icon"><Clock size={24} color="#3b82f6" /></div>
          <div className="card-content">
            <div className="card-label">Today's Focus</div>
            <div className="card-value">{formatTime(secondsToday)}</div>
            <div className="card-subtext">{todayMinutes} minutes logged</div>
          </div>
        </div>

        <div className="stat-card gradient-green">
          <div className="card-icon"><TrendingUp size={24} color="#10b981" /></div>
          <div className="card-content">
            <div className="card-label">Weekly Total</div>
            <div className="card-value">{totalWeekMinutes.toFixed(0)} min</div>
            <div className="card-subtext">Avg {avgDaily} min/day</div>
          </div>
        </div>

        <div className="stat-card gradient-purple">
          <div className="card-icon"><Calendar size={24} color="#8b5cf6" /></div>
          <div className="card-content">
            <div className="card-label">This Month</div>
            <div className="card-value">{monthlyTotal.toFixed(0)} min</div>
            <div className="card-subtext">Keep it up! 💪</div>
          </div>
        </div>
      </div>

      {/* ----- WEEKLY CHART ----- */}
      <div className="dashboard-card-large">
        <div className="card-header">
          <h2 className="card-title">📊 Weekly Study Progress</h2>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.minutes)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
