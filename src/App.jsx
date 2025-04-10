import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
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
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const strategiesRef = useRef(null);
  const researchRef = useRef(null);
  const productsRef = useRef(null);
  const analyticsRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);

  const refs = {
    homeRef,
    aboutRef,
    strategiesRef,
    researchRef,
    productsRef,
    analyticsRef,
    pricingRef,
    contactRef,
  };

  return (
    <div className="min-h-screen bg-gray-900" ref={homeRef}>
      <Navbar refs={refs} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <About ref={aboutRef} />
              <Strategies ref={strategiesRef} />
              <Research ref={researchRef} />
              <Products ref={productsRef} />
              <Analytics ref={analyticsRef} />
              <Pricing ref={pricingRef} />
              <Contact ref={contactRef} />
            </>
          }
        />
        <Route path="/strategy/:name" element={<ApiRes />} />
      </Routes>
    </div>
  );
}

export default App;