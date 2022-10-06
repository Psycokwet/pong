import React from "react";
import { FULL_ROUTE } from "shared/httpsRoutes/routes";
import { PREFIX } from "../../api/api";
const LoginPage = () => {
  const redirectOauth = () => {
    window.location.replace(PREFIX + FULL_ROUTE.AUTH.ENDPOINT);
  };
  /***************************************************************/

  return (
    <div className="flex flex-col justify-center items-center space-y-16 bg-gray-900 text-white h-screen text-center">
      <h1 className="font-bold text-6xl h-auto py-8">The Pinging Pong</h1>
      <div>
        <div className="border-4 p-40 border-solid rounded-3xl w-full">
          <button
            className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
            onClick={redirectOauth}
          >
            Login with 42
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
