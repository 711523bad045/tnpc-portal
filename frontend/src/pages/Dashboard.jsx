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
import { Clock, Calendar, Award, Zap, Target, Brain } from "lucide-react";
import "./Dashboard.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getTodayLabel = () => {
  const dayIndex = new Date().getDay();
  return DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
};

function Dashboard() {
  const [weeklyData, setWeeklyData] = useState(
    DAYS.map((day) => ({ day, minutes: 0 }))
  );
  const [monthlyData, setMonthlyData] = useState([]);
  const [secondsToday, setSecondsToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const timerIntervalRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const todayLabel = getTodayLabel();

  const totalWeekMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const avgDaily = (totalWeekMinutes / 7).toFixed(0);
  const todayMinutes = (secondsToday / 60).toFixed(0);
  const todayHours = (secondsToday / 3600).toFixed(1);

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
    loadMonthlyData();
    calculateStreak();
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

  const loadMonthlyData = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/study/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMonthlyData(res.data);
        const total = res.data.reduce((sum, item) => sum + (Number(item.minutes) || 0), 0);
        setMonthlyTotal(total);
      })
      .catch((err) => console.error(err));
  };

  const calculateStreak = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/study/streak", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentStreak(res.data.streak))
      .catch((err) => console.error(err));
  };

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

  useEffect(() => {
    const minutes = Number((secondsToday / 60).toFixed(2));
    setWeeklyData((prev) =>
      prev.map((item) =>
        item.day === todayLabel ? { ...item, minutes } : item
      )
    );
  }, [secondsToday, todayLabel]);

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

      if (!isFinal) {
        loadWeeklyData();
        loadMonthlyData();
        calculateStreak();
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

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

  const activeDays = monthlyData.filter(d => d.minutes > 0).length;
  const monthlyHours = (monthlyTotal / 60).toFixed(1);

  return (
    <div className="dashboard-page">
      {/* Hero Section with Timer */}
      <div className="hero-section">
        <div className="hero-header">
          <Brain size={48} color="#fff" strokeWidth={2.5} />
          <div>
            <h1 className="hero-title">Study Tracker</h1>
            <p className="hero-subtitle">Your learning journey, visualized</p>
          </div>
        </div>
        
        <div className="timer-section">
          <div className="timer-label">TODAY'S SESSION</div>
          <div className="timer-display">{formatTime(secondsToday)}</div>
          <div className="timer-stats">
            <span>{todayMinutes} minutes</span>
            <span className="dot">•</span>
            <span>{todayHours} hours</span>
          </div>
        </div>

        <div className="streak-badge-new">
          <Award size={32} color="#fbbf24" fill="#fbbf24" />
          <div className="streak-text">
            <span className="streak-number">{currentStreak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid-new">
        <div className="stat-card-new card-purple">
          <div className="stat-icon-new">
            <Zap size={28} color="#a855f7" />
          </div>
          <div className="stat-content-new">
            <div className="stat-label-new">Weekly Total</div>
            <div className="stat-value-new">{totalWeekMinutes.toFixed(0)}</div>
            <div className="stat-unit-new">minutes</div>
            <div className="stat-sub-new">Avg {avgDaily} min/day</div>
          </div>
        </div>

        <div className="stat-card-new card-blue">
          <div className="stat-icon-new">
            <Calendar size={28} color="#3b82f6" />
          </div>
          <div className="stat-content-new">
            <div className="stat-label-new">This Month</div>
            <div className="stat-value-new">{monthlyHours}</div>
            <div className="stat-unit-new">hours</div>
            <div className="stat-sub-new">{activeDays} active days</div>
          </div>
        </div>

        <div className="stat-card-new card-green">
          <div className="stat-icon-new">
            <Target size={28} color="#10b981" />
          </div>
          <div className="stat-content-new">
            <div className="stat-label-new">Daily Goal</div>
            <div className="stat-value-new">{Math.min(100, (todayMinutes / 60) * 100).toFixed(0)}%</div>
            <div className="stat-unit-new">complete</div>
            <div className="stat-sub-new">Target: 60 min</div>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="chart-card-new">
        <div className="chart-header-new">
          <div>
            <h2 className="chart-title-new">Weekly Performance</h2>
            <p className="chart-subtitle-new">Last 7 days breakdown</p>
          </div>
          <div className="chart-legend-new">
            <div className="legend-item-new">
              <div className="legend-dot-new" style={{ backgroundColor: "#10b981" }}></div>
              <span>Excellent 90+</span>
            </div>
            <div className="legend-item-new">
              <div className="legend-dot-new" style={{ backgroundColor: "#3b82f6" }}></div>
              <span>Good 60-90</span>
            </div>
            <div className="legend-item-new">
              <div className="legend-dot-new" style={{ backgroundColor: "#f59e0b" }}></div>
              <span>Fair 30-60</span>
            </div>
          </div>
        </div>
        <div className="chart-container-new">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: "#6b7280", fontSize: 14, fontWeight: 600 }}
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
                  padding: "12px 16px",
                  fontWeight: 600
                }}
              />
              <Bar dataKey="minutes" radius={[12, 12, 0, 0]}>
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