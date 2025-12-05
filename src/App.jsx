import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

import QuestionBank from "./pages/QuestionBank";

import AdminLogin from "./pages/AdminLogin";
import AdminQuestionBank from "./pages/AdminQuestionUpload";
import SubjectQuestions from "./pages/SubjectQuestions";  // show questions by subject
import DailyTest from "./pages/DailyTest";
import TakeTest from "./pages/TakeTest";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/daily-test" element={<DailyTest />} />
      <Route path="/daily-test/:subject" element={<TakeTest />} />

      {/* REMOVED DAILY TEST */}
      {/* <Route path="/daily-test" element={<DailyTest />} /> */}

      <Route path="/question-bank" element={<QuestionBank />} />
      <Route path="/question-bank/:subject" element={<SubjectQuestions />} />

      <Route  path="/dashboard" element={
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
