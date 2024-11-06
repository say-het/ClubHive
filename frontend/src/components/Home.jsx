import React from 'react';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-4 bg-gray-100">
          {/* Inner Frame for Main Content */}
          <div className="border-2 border-black p-4 relative h-full">
            {/* Shapes or Content */}
            <div className="absolute top-4 left-4 w-1/3 h-1/4 bg-gray-300">Club 1</div>
            <div className="absolute top-4 right-4 w-1/3 h-1/4 bg-gray-300">Club 2</div>
            <div className="absolute bottom-4 left-4 w-1/3 h-1/4 bg-gray-300">Club 3</div>
            <div className="absolute bottom-4 right-4 w-1/3 h-1/4 bg-blue-300">Inter college club 1</div>
          </div>
        </div>
        {/* Right Sidebar Panel */}
        <div className="w-1/5 bg-gray-200 p-4 border-l-2 border-black">
          <h2 className="text-lg font-semibold">Sidebar</h2>
          <p>- register club</p>
          <p>- Check existing clubs</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
  