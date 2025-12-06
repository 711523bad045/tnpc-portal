import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const StudyTimerContext = createContext();
export const useStudyTimer = () => useContext(StudyTimerContext);

export function StudyTimerProvider({ children }) {
  const [secondsToday, setSecondsToday] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const timerRef = useRef(null);
  const saveRef = useRef(null);
  const secondsRef = useRef(0); // Keep track of current seconds

  // Update ref whenever seconds change
  useEffect(() => {
    secondsRef.current = secondsToday;
  }, [secondsToday]);

  // -----------------------------------------------------
  // Load today's SECONDS from backend once on startup
  // -----------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoaded(true);
      return;
    }

    axios
      .get("http://localhost:5000/api/study/today", {
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
  }, []);

  // -----------------------------------------------------
  // Save function using ref to get latest value
  // -----------------------------------------------------
  const saveProgress = async (isFinal = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const currentSeconds = secondsRef.current;
    
    if (currentSeconds === 0 && !isFinal) {
      return; // Don't save 0 unless it's final save
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/study/update",
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
    if (!isLoaded) return;

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

    // Save on page visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👋 Tab hidden - saving progress");
        saveProgress(false);
      }
    };

    // Save before page unload
    const handleBeforeUnload = (e) => {
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
      saveProgress(true); // Final save
      
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoaded]);

  return (
    <StudyTimerContext.Provider value={{ secondsToday, isLoaded, saveProgress }}>
      {children}
    </StudyTimerContext.Provider>
  );
}