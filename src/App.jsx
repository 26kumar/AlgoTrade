import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    <Router>
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
    </Router>
  );
}

export default App;
