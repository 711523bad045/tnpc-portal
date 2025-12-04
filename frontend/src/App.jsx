import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import DailyTest from "./pages/DailyTest"; 
import QuestionBank from "./pages/QuestionBank";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/daily-test" element={<DailyTest />} />
      {/* Dashboard inside layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout> } />
      <Route path="/question-bank" element={<QuestionBank />} />
    </Routes>
    
  );
}

export default App;
