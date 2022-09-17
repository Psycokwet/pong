import React from "react";
import { useState } from "react";

const LoginPage = () => {
  /***************************************************************
   * This part is for connecting to backend
   * I'm not sure how it's done yet so it's just a general idea
   ***************************************************************/
  // const [loginState, setLoginState] = useState(false);

  const goOauth = () => {
    // setLoginState(!loginState);
    // console.log(loginState);
    window.location.replace("http://localhost:8080/api/auth/42")
  };
  /***************************************************************/

  return (
    <div className="flex flex-col justify-center items-center space-y-16 bg-gray-900 text-white h-screen text-center">
      <h1 className="font-bold text-6xl h-auto py-8">The Pinging Pong</h1>
      <div>
        <div className="border-4 p-40 border-solid rounded-3xl w-full">
          <button
            className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
            onClick={goOauth}
          >Login with 42</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
