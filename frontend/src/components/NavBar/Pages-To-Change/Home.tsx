import React from 'react'

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-16 bg-gray-900 text-white h-screen text-center">
      <h1 className="font-bold text-6xl h-auto py-8">Welcome!</h1>
      <div>
        <div className="border-4 p-40 border-solid rounded-3xl w-full">
          <button
            className="bg-red-500 hover:bg-red-700 text-3xl rounded-3xl p-4 shadow-md shadow-red-500/50"
          >
            Quick Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home