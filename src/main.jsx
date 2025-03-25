import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // ✅ Import HashRouter
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> {/* ✅ No need to wrap App with HashRouter here */}
  </React.StrictMode>
);
