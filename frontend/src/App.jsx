import React, { useState } from 'react';  // <-- Add this import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Login from "./authentication/login";
import Signup from "./authentication/Signup";
import Club from "./components/Club";
import User from "./components/User";
import Chat from "./components/Chat";
import UserProfile from './components/User';
  // import Darkness from "./components/Darkmodecontext"
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  return (
    <Router>       
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> {/* Pass state and setter to Navbar */} 
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/clubs/:id" element={<Club />} />
          <Route path ="/user" element={<User />} />
          <Route path ="/chat/:id" element={<Chat />} /> 
          <Route path ="profile/:id" element ={<UserProfile />}/>
          {/* <Route path="/profile/:email" element={<UserProfile />} /> */}

          </Routes>
    </Router>
  );
}

