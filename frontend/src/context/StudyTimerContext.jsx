import { createContext, useContext, useEffect, useRef, useState } from "react";
import API from "../api/axios";
const StudyTimerContext = createContext();
export const useStudyTimer = () => useContext(StudyTimerContext);

export function StudyTimerProvider({ children }) {
  const [secondsToday, setSecondsToday] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const timerRef = useRef(null);
  const saveRef = useRef(null);
  const secondsRef = useRef(0);

  // Update ref whenever seconds change
  useEffect(() => {
    secondsRef.current = secondsToday;
  }, [secondsToday]);

  // -----------------------------------------------------
  // 🔑 KEY FIX: Monitor token changes (login/logout)
  // -----------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // User logged out - reset everything
      console.log("🚪 No token - resetting timer");
      setSecondsToday(0);
      secondsRef.current = 0;
      setCurrentUserId(null);
      setIsLoaded(true);
      return;
    }

    // Decode token to get user ID
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      // If user changed, reload data
      if (userId !== currentUserId) {
        console.log(" User changed, loading new data for user:", userId);
        setCurrentUserId(userId);
        setIsLoaded(false); // Trigger reload
        loadTodayData(token);
      }
    } catch (err) {
      console.error(" Invalid token format:", err);
      setSecondsToday(0);
      setIsLoaded(true);
    }
  }, []); // Run once on mount

  // Also check for token changes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token && currentUserId !== null) {
        // User logged out
        console.log("🚪 User logged out - resetting timer");
        setSecondsToday(0);
        secondsRef.current = 0;
        setCurrentUserId(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUserId]);

  // -----------------------------------------------------
  // Load today's SECONDS from backend
  // -----------------------------------------------------
  const loadTodayData = (token) => {
      API.get("/study/today", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const savedSeconds = Number(res.data.seconds || 0);
        setSecondsToday(savedSeconds);
        secondsRef.current = savedSeconds;
        console.log("✅ Loaded today's seconds:", savedSeconds);
      })
      .catch((err) => {
        console.error("❌ Load today failed:", err);
        setSecondsToday(0);
      })
      .finally(() => setIsLoaded(true));
  };

  // -----------------------------------------------------
  // Save function using ref to get latest value
  // -----------------------------------------------------
  const saveProgress = async (isFinal = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const currentSeconds = secondsRef.current;
    
    if (currentSeconds === 0 && !isFinal) {
      return;
    }

    try {
      await API.post(
  "/study/update",
        { seconds: currentSeconds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(
        isFinal ? "🏁 Final save:" : "💾 Auto-save:",
        currentSeconds,
        "seconds"
      );
    } catch (err) {
      console.error("❌ Save failed:", err.response?.data || err.message);
    }
  };

  // -----------------------------------------------------
  // Start timer AFTER initial load
  // -----------------------------------------------------
  useEffect(() => {
    if (!isLoaded || !currentUserId) return;

    console.log("⏰ Starting timer from:", secondsRef.current);

    // Increase seconds locally every second
    timerRef.current = setInterval(() => {
      setSecondsToday((prev) => {
        const newValue = prev + 1;
        secondsRef.current = newValue;
        return newValue;
      });
    }, 1000);

    // Auto-save to backend every 20 seconds
    saveRef.current = setInterval(() => {
      saveProgress(false);
    }, 20000);

    // Save on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👋 Tab hidden - saving progress");
        saveProgress(false);
      }
    };

    // Save before page unload
    const handleBeforeUnload = () => {
      console.log("🚪 Page unloading - final save");
      saveProgress(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup when component unmounts
    return () => {
      console.log("🛑 Timer cleanup - final save");
      clearInterval(timerRef.current);
      clearInterval(saveRef.current);
      saveProgress(true);
      
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoaded, currentUserId]);

  return (
    <StudyTimerContext.Provider value={{ secondsToday, isLoaded, saveProgress }}>
      {children}
    </StudyTimerContext.Provider>
  );
}