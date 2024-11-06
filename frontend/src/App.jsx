import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Login from "./authentication/login";
import Signup from "./authentication/Signup";
export default function App() {
  return (
    <Router>        
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </Router>
  );
}
