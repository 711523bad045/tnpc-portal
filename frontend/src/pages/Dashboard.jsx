import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
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
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getTodayLabel = () => {
  const dayIndex = new Date().getDay();
  return DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
};

// Generate heatmap data (you can replace this with real data from backend later)
const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    data.push({
      date: date,
      month: date.getMonth(),
      intensity: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
    });
  }
  return data;
};

function Dashboard() {
  const [weeklyData, setWeeklyData] = useState(
    DAYS.map((day) => ({ day, minutes: 0 }))
  );
  const [secondsToday, setSecondsToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData] = useState(generateHeatmapData());

  const timerIntervalRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const todayLabel = getTodayLabel();

  // Stats calculations
  const totalWeekMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const avgDaily = (totalWeekMinutes / 7).toFixed(0);
  const todayMinutes = (secondsToday / 60).toFixed(0);

  // ================= LOAD TODAY + WEEKLY DATA =====================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/study/today", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const savedMinutes = Number(res.data.minutes || 0);
        setSecondsToday(Math.round(savedMinutes * 60));
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    loadWeeklyData();
  }, []);

  const loadWeeklyData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/study/weekly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWeeklyData(res.data))
      .catch((err) => console.error(err));
  };

  // ================= TIMER + AUTO SAVE =====================
  useEffect(() => {
    if (isLoading) return;

    timerIntervalRef.current = setInterval(() => {
      setSecondsToday((s) => s + 1);
    }, 1000);

    saveIntervalRef.current = setInterval(() => {
      saveProgress();
    }, 20000);

    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(saveIntervalRef.current);
      saveProgress(true);
    };
  }, [isLoading]);

  // ================= UPDATE LIVE WEEKLY GRAPH =====================
  useEffect(() => {
    const minutes = Number((secondsToday / 60).toFixed(2));

    setWeeklyData((prev) =>
      prev.map((item) =>
        item.day === todayLabel ? { ...item, minutes } : item
      )
    );
  }, [secondsToday, todayLabel]);

  // ================= SAVE TO BACKEND =====================
  const saveProgress = async (isFinal = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const minutes = Number((secondsToday / 60).toFixed(2));

    try {
      await axios.post(
        "http://localhost:5000/api/study/update",
        { minutes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!isFinal) loadWeeklyData();
      if (isFinal) console.log("Final saved:", minutes);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  // ================= PAGE VISIBILITY / REFRESH SAVE =====================
  useEffect(() => {
    const handleBeforeUnload = () => saveProgress(true);
    const handleVisibility = () => {
      if (document.hidden) saveProgress(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [secondsToday]);

  // ================= FORMAT TIMER =====================
  const formatTime = (sec) => {
    sec = Math.round(sec);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getIntensityColor = (intensity) => {
    const colors = ["#e5e7eb", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"];
    return colors[intensity] || colors[0];
  };

  // Get bar color based on value
  const getBarColor = (minutes) => {
    if (minutes >= 90) return "#10b981";
    if (minutes >= 60) return "#3b82f6";
    if (minutes >= 30) return "#f59e0b";
    return "#ef4444";
  };

  if (isLoading) {
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
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Study Dashboard</h1>
          <p className="dashboard-subtitle">Track your learning journey 🚀</p>
        </div>
        <div className="streak-badge">
          <Award size={24} color="#f59e0b" />
          <div className="streak-info">
            <div className="streak-number">7</div>
            <div className="streak-label">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card gradient-blue">
          <div className="card-icon">
            <Clock size={24} color="#3b82f6" />
          </div>
          <div className="card-content">
            <div className="card-label">Today's Focus</div>
            <div className="card-value">{formatTime(secondsToday)}</div>
            <div className="card-subtext">{todayMinutes} minutes logged</div>
          </div>
        </div>

        <div className="stat-card gradient-green">
          <div className="card-icon">
            <TrendingUp size={24} color="#10b981" />
          </div>
          <div className="card-content">
            <div className="card-label">Weekly Total</div>
            <div className="card-value">{totalWeekMinutes.toFixed(0)} min</div>
            <div className="card-subtext">Avg {avgDaily} min/day</div>
          </div>
        </div>

        <div className="stat-card gradient-purple">
          <div className="card-icon">
            <Calendar size={24} color="#8b5cf6" />
          </div>
          <div className="card-content">
            <div className="card-label">This Month</div>
            <div className="card-value">2,340 min</div>
            <div className="card-subtext">+23% from last month</div>
          </div>
        </div>
      </div>

      {/* Heatmap Card */}
      <div className="dashboard-card-large">
        <div className="card-header">
          <h2 className="card-title">📅 Yearly Study Heatmap</h2>
          <div className="heatmap-legend">
            <span className="legend-text">Less</span>
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="legend-box"
                style={{ backgroundColor: getIntensityColor(i) }}
              />
            ))}
            <span className="legend-text">More</span>
          </div>
        </div>
        
        <div className="heatmap-container">
          {/* Month labels */}
          <div className="month-labels">
            {MONTHS.map((month, idx) => (
              <span key={idx} className="month-label">{month}</span>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="heatmap-grid">
            {heatmapData.map((item, i) => (
              <div
                key={i}
                className="heatmap-cell"
                style={{
                  backgroundColor: getIntensityColor(item.intensity),
                  animationDelay: `${i * 0.001}s`
                }}
                title={`${item.date.toLocaleDateString()}: ${item.intensity * 25} min`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Chart Card */}
      <div className="dashboard-card-large">
        <div className="card-header">
          <h2 className="card-title">📊 Weekly Study Progress</h2>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: "#10b981" }} />
              <span>Excellent (90+ min)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: "#3b82f6" }} />
              <span>Good (60-90 min)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: "#f59e0b" }} />
              <span>Fair (30-60 min)</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: "#6b7280", fontSize: 14 }}
                stroke="#d1d5db"
              />
              <YAxis 
                tick={{ fill: "#6b7280", fontSize: 14 }}
                stroke="#d1d5db"
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: "#6b7280" }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  padding: "12px"
                }}
              />
              <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.minutes)} />
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