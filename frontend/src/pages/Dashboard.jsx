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
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Dashboard() {
  const { secondsToday, isLoaded } = useStudyTimer(); 
  const [weeklyData, setWeeklyData] = useState(
    DAYS.map((d) => ({ day: d, minutes: 0 }))
  );
  const [heatmapData, setHeatmapData] = useState([]);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(true);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const totalWeekMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const avgDaily = (totalWeekMinutes / 7).toFixed(0);
  const todayMinutes = (secondsToday / 60).toFixed(0);

  // Load all backend data once on mount
  useEffect(() => {
    loadWeeklyData();
    loadMonthlyData();
    loadStreak();
    loadHeatmapData();
  }, []);

  // Reload data periodically (every minute)
  useEffect(() => {
    if (secondsToday > 0 && secondsToday % 60 === 0) {
      loadWeeklyData();
      loadMonthlyData();
      loadStreak();
    }
  }, [secondsToday]);

  const loadWeeklyData = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/study/weekly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWeeklyData(res.data))
      .catch((err) => console.error("❌ Load weekly error:", err));
  };

  const loadMonthlyData = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/study/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMonthlyTotal(res.data.total || 0))
      .catch((err) => console.error("❌ Load monthly error:", err));
  };

  const loadStreak = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/study/streak", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStreak(res.data.streak || 0))
      .catch((err) => console.error("❌ Load streak error:", err));
  };

  const loadHeatmapData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsHeatmapLoading(false);
      return;
    }

    setIsHeatmapLoading(true);
    
    axios
      .get("http://localhost:5000/api/study/heatmap", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Heatmap data loaded:", res.data.length, "days");
        setHeatmapData(res.data);
      })
      .catch((err) => {
        console.error("❌ Load heatmap error:", err);
        setHeatmapData([]);
      })
      .finally(() => setIsHeatmapLoading(false));
  };

  const formatTime = (sec) => {
    sec = Math.round(sec);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getIntensityColor = (i) => {
    const colors = ["#e5e7eb", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"];
    return colors[i] || colors[0];
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

      {/* ----- HEATMAP WITH REAL DATA ----- */}
      <div className="dashboard-card-large">
        <div className="card-header">
          <h2 className="card-title">📅 Yearly Activity Heatmap</h2>
          <div className="heatmap-legend">
            <span className="legend-text">Less</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="legend-box" style={{ backgroundColor: getIntensityColor(i) }} />
            ))}
            <span className="legend-text">More</span>
          </div>
        </div>

        {isHeatmapLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading activity data...</p>
          </div>
        ) : heatmapData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            <p>No activity data yet. Start studying and taking tests to see your progress!</p>
          </div>
        ) : (
          <>
            <div className="heatmap-container">
              <div className="month-labels">
                {MONTHS.map((m, idx) => <span key={idx} className="month-label">{m}</span>)}
              </div>

              <div className="heatmap-grid">
                {heatmapData.map((item, i) => (
                  <div
                    key={i}
                    className="heatmap-cell"
                    title={`${item.date}: ${item.testCount} tests, ${Math.round(item.studySeconds / 60)} min`}
                    style={{
                      backgroundColor: getIntensityColor(item.intensity),
                      animationDelay: `${i * 0.001}s`,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f9fafb', 
              borderRadius: '8px',
              fontSize: '13px',
              color: '#6b7280'
            }}>
              <strong>Legend:</strong> Gray = No activity, Light Blue = Study only, 
              Blue = 1 test, Dark Blue = 2-3 tests, Darkest = 4+ tests completed
            </div>
          </>
        )}
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