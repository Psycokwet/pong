import React from "react";
import { useState } from "react";
import { Api } from "../../api/api";

const SignInPage = () => {
  const api = new Api();
  
  // Todo: get 42login and put it as initial value
  const [nickname, setNickName] = useState("");
  const [file, setFile] = useState(null);
  const [twoFactor, setTwoFactor] = useState(false);

  const submitForm = () => {
    //send new nickname, photo, 2-factor-auth-status to back
    const formData = new FormData();
    formData.append("file", file);

    api.setPicture(formData).then((res: Response) => {
      if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
        res.json().then((content) => {
          console.log("set picture is ok", content);
        });
    });

    api.set_nickname(nickname).then((res: Response) => {
      if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
        res.json().then((content) => {
          console.log("set nickname is ok", content);
        });
    });

    // Todo: set 2Factor through api.
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleTwoFactor = (event) => {
    setTwoFactor(true);
  };
  const handleNickName = (event) => {
    setNickName(event.target);
  };

  return (
    <form className="text-white bg-gray-900 h-screen flex flex-col">
      <h1>Choose your nickname</h1>
      <input
        type="text"
        value={nickname}
        onChange={handleNickName}
        placeholder="Choose your nickname"
        className="text-gray-900 placeholder:text-gray-400 outline_none rounded-xl"
      />
      {/* Should I add something to pre-display the photo? */}
      <img
        src="https://img.lemde.fr/2019/05/17/0/0/3553/2542/664/0/75/0/74a2a9f_91ae3c37d18b44d4ae49147a7b9a2126-91ae3c37d18b44d4ae49147a7b9a2126-0.jpg"
        alt="random_avatar"
        className="w-80 rounded-full"
      />
      <h1>Choose your avatar</h1>
      <input type="file" onChange={handleFileChange} />
      <input type="checkbox" onChange={handleTwoFactor} />{" "}
      <span>Activate Two-Factor Authentication</span>
      
      <button onClick={submitForm}>Submit Everything</button>
    </form>
  );
};

export default SignInPage;
