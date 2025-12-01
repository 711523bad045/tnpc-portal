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
} from "recharts";
import "./Dashboard.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getTodayLabel = () => {
  const dayIndex = new Date().getDay(); // 0 = Sun
  return DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
};

const examDate = new Date("2026-02-15T09:00:00");

function Dashboard() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  const [weeklyData, setWeeklyData] = useState(
    DAYS.map((day) => ({ day, minutes: 0 }))
  );

  const [secondsToday, setSecondsToday] = useState(0);

  const timerIntervalRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const todayLabel = getTodayLabel();

  // ================= COUNTDOWN =====================
  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = examDate - now;

      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };

    calculate();
    const id = setInterval(calculate, 60000);
    return () => clearInterval(id);
  }, []);

  // ================= LOAD WEEKLY DATA =====================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/study/weekly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWeeklyData(res.data);

        const todayRow = res.data.find((d) => d.day === todayLabel);

        if (todayRow && todayRow.minutes > 0) {
          setSecondsToday(todayRow.minutes * 60);
        }
      })
      .catch((err) => console.error("Load weekly failed", err));
  }, [todayLabel]);

  // ============== LIVE TIMER + SAVE EVERY 20 SEC ==============
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setSecondsToday((prev) => prev + 1);
    }, 1000);

    saveIntervalRef.current = setInterval(() => {
      saveProgress();
    }, 20000); // 🔥 save every 20 sec

    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(saveIntervalRef.current);
      saveProgress(true);
    };
  }, []);

  // ============== UPDATE GRAPH LIVE ==============
  useEffect(() => {
    const minutes = Math.floor(secondsToday / 60);

    setWeeklyData((prev) =>
      prev.map((item) =>
        item.day === todayLabel ? { ...item, minutes } : item
      )
    );
  }, [secondsToday, todayLabel]);

  // ============== SAVE TO BACKEND ==============
  const saveProgress = async (isFinal = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const minutes = Math.floor(secondsToday / 60);

    try {
      await axios.post(
        "http://localhost:5000/api/study/update",
        { minutes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (isFinal) console.log("Final saved:", minutes);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  // ================= FORMAT TIMER =====================
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>
          Welcome, Student 👋
        </h1>
      </div>

      <div className="dashboard-row">
        {/* Countdown card */}
        <div className="dashboard-card">
          <h2>⏳ Group 4 Exam Countdown</h2>
          <p className="big-count">
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
          </p>
        </div>

        {/* Timer card */}
        <div className="dashboard-card">
          <h2>🎯 Today&apos;s Focus Timer</h2>
          <p className="timer-value">{formatTime(secondsToday)}</p>
        </div>
      </div>

      {/* Weekly Graph */}
      <div className="dashboard-card full-width">
        <h2>📊 Weekly Study Progress</h2>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#0066ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
