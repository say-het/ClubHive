import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Login from "./authentication/login";
import Signup from "./authentication/Signup";
import Club from "./components/Club";
export default function App() {
  return (
    <Router>        
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/club" element={<Club />} /> {/* Club page with dynamic ID */}
          </Routes>
    </Router>
  );
}
