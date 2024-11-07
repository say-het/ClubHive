import React, { useDebugValue, useState } from 'react';
import Navbar from './Navbar';
import { useEffect } from 'react';


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
<>
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">Welcome {name}</h1>
        <p className="text-xl text-gray-700">Your journey to explore, learn, and engage starts here!</p>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800">Explore Our Features</h2>
        <p className="text-lg text-gray-600">Find the latest content, discover interactive tools, and much more.</p>
        
        <div className="mt-6 space-x-4">
          <button
            onClick={() => window.location.href = '/about'}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Learn More
          </button>
          <button
            onClick={() => window.location.href = '/contact'}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
    </>

  );
}

export default Welcome;
