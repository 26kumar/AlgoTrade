import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom"; // ✅ Use HashRouter
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Strategies from "./components/Strategies";
import Research from "./components/Research";
import Products from "./components/Products";
import Analytics from "./components/Analytics";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import ApiRes from "./components/ApiRes";

function App() {
  return (
    <HashRouter> {/* ✅ Use HashRouter directly */}
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <About />
                <Strategies />
                <Research />
                <Products />
                <Analytics />
                <Pricing />
                <Contact />
              </>
            }
          />
          <Route path="/strategy/:name" element={<ApiRes />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
