import React from "react";
import "./styles.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter } from "react-router-dom";
import { StudyTimerProvider } from "./context/StudyTimerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StudyTimerProvider>
        <App />
      </StudyTimerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
