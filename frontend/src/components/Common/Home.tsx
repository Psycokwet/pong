import React from "react";

const waitForOpponent = () => {
  console.log("Waiting for component...")
};

const Home = () => {
  return (
    <div className="flex flex-col items-center bg-gray-900 text-white h-screen text-center">
      <h1 className="font-bold text-6xl h-auto py-16">Welcome to Pong</h1>
      <button
        className="bg-red-600 hover:bg-red-700 text-3xl rounded-3xl p-4 shadow-md shadow-red-500/50"
        onClick={waitForOpponent}
      >
        Quick Play
      </button>
    </div>
  );
};

export default Home;
