import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

import QuestionBank from "./pages/QuestionBank";
import Account from "./pages/Account";
import AdminLogin from "./pages/AdminLogin";
import AdminQuestionBank from "./pages/AdminQuestionUpload";
import SubjectQuestions from "./pages/SubjectQuestions";

import DailyTest from "./pages/DailyTest";
import TakeTest from "./pages/TakeTest";

import VideoClasses from "./pages/VideoClasses";
import TamilVideos from "./pages/videos/TamilVideos";
import EnglishVideos from "./pages/videos/EnglishVideos";
import MathsVideos from "./pages/videos/MathsVideos";
import SocialVideos from "./pages/videos/SocialVideos";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* DAILY TEST */}
      <Route path="/daily-test" element={<DailyTest />} />
      <Route path="/daily-test/:subject" element={<TakeTest />} />

      {/* VIDEO CLASSES MAIN PAGE */}
      <Route
        path="/video-classes"
        element={
          <Layout>
            <VideoClasses />
          </Layout>
        }
      />
      <Route path="/account" element={<Account />} />
      {/* Optional support for /videos */}
      <Route
        path="/videos"
        element={
          <Layout>
            <VideoClasses />
          </Layout>
        }
      />

      {/* SUBJECT VIDEO PAGES */}
      <Route
        path="/videos/tamil"
        element={
          <Layout>
            <TamilVideos />
          </Layout>
        }
      />

      <Route
        path="/videos/english"
        element={
          <Layout>
            <EnglishVideos />
          </Layout>
        }
      />

      <Route
        path="/videos/maths"
        element={
          <Layout>
            <MathsVideos />
          </Layout>
        }
      />

      <Route
        path="/videos/social"
        element={
          <Layout>
            <SocialVideos />
          </Layout>
        }
      />

      {/* QUESTION BANK */}
      <Route path="/question-bank" element={<QuestionBank />} />
      <Route path="/question-bank/:subject" element={<SubjectQuestions />} />

      {/* DASHBOARD WITH LAYOUT */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      {/* ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/question-bank" element={<AdminQuestionBank />} />

    </Routes>
  );
}

export default App;
