import React from "react";

const Loading = () => {
  return (

    <div className="flex flex-col justify-center items-center space-y-16 bg-gray-900 text-white h-7/8 text-center">
    <h1 className="font-bold text-6xl h-auto py-8  animate-pulse">Page is loading ...</h1>
    <div>
      <div className="border-4 p-40 border-solid rounded-3xl w-full">
        <img
          src="https://media4.giphy.com/media/xThuWtNFKZWG6fUFe8/giphy.gif"
          alt="funny animation GIF"
        />
      </div>
    </div>
  </div>
  );
};

export default Loading;
