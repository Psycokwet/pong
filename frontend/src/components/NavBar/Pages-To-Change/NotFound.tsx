import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div>
        <div className="text-5xl font-bold">
            404: Page Not Found. 
        </div>   
        <div className="text-red-800 text-5xl animate-pulse">
            Redirecting to Homepage...
        </div>
    </div>
  )
};

export default NotFound;
