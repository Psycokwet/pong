import { useState } from "react";
import { FULL_ROUTE } from "../../../shared/httpsRoutes/routes";
const False42Login = () => {
  /***************************************************************/

  const [cdaiLogin, setCdaiLogin] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleLogin42Change = (e) => {
    setCdaiLogin(e.target.value)
  }
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-16 bg-gray-900 text-white h-screen text-center">
      <h1 className="font-bold text-6xl h-auto py-8">The False 42 Login</h1>
      <form action={import.meta.env.VITE_PONG_URL_BACK + FULL_ROUTE.AUTH.FALSE_42_LOGIN} method="get">
        <label htmlFor="login42">false login42</label>
        <br />
        <input type="text" name="login42" onChange={handleLogin42Change} value={cdaiLogin}/>
        <br />
        <label htmlFor="email">false email</label>
        <br />
        <input type="text" name="email" onChange={handleEmailChange} value={email}/>
        <br />
        <input 
            className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50" type="submit" value="false login button" />
      </form>
    </div>
  );
};

export default False42Login;
