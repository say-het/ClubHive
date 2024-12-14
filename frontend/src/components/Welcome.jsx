import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Importing framer-motion for animations

function Welcome() {
  const [name, setName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setName(JSON.parse(user).name);
    } else {
      setName('');
    }
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 flex flex-col items-center justify-center text-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Header Section */}
      <motion.div
        className="space-y-4 mb-12"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
      >
        <h1 className="text-5xl font-extrabold text-blue-800">
          Welcome {name || 'to Our Platform'}
        </h1>
        <p className="text-xl text-gray-800">
          A platform to manage your college clubs effortlessly, stay updated, and engage with your community.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="mt-12 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2 className="text-3xl font-semibold text-blue-700">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg text-gray-700">
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <i className="fas fa-users"></i>
            </motion.div>
            <p className="text-xl">College Club Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-14 h-14 bg-yellow-600 text-white rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 25 }}
            >
              <i className="fas fa-bullhorn"></i>
            </motion.div>
            <p className="text-xl">Event Banners</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 25 }}
            >
              <i className="fas fa-comments"></i>
            </motion.div>
            <p className="text-xl">Chatroom & Notifications</p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action Buttons */}
      <motion.div
        className="mt-12 space-x-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <button
          onClick={() => window.location.href = '/about'}
          className="px-8 py-4 bg-blue-600 text-white font-medium rounded-full shadow-lg transform transition-all hover:scale-105 hover:bg-blue-500"
        >
          Learn More
        </button>
        <button
          onClick={() => window.location.href = '/contact'}
          className="px-8 py-4 bg-gray-600 text-white font-medium rounded-full shadow-lg transform transition-all hover:scale-105 hover:bg-gray-500"
        >
          Contact Us
        </button>
      </motion.div>
    </motion.div>
  );
}

export default Welcome;
