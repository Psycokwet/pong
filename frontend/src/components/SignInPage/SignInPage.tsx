import React from "react";
import { useState } from "react";
import { Api } from "../../api/api";

const MAX_CHAR = 5;
const SignInPage = () => {
  const api = new Api();
  // Todo: get 42login and put it as initial value
  const [nickname, setNickName] = useState("");
  const [file, setFile] = useState(null);
  const [twoFactor, setTwoFactor] = useState("false");

  const handleSubmitForm = (e) => {
    // send new nickname, photo, 2-factor-auth-status to back
    e.preventDefault();

    if (file) {
      const fileData = new FormData();
      fileData.append("file", file);

      api.setPicture(fileData).then((res: Response) => {
        if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
          res.json().then((content) => {
            console.log("set picture is ok", content);
          });
      });
    }

    api.set_nickname(nickname).then((res: Response) => {
      if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
        res.json().then((content) => {
          console.log("set nickname is ok", content);
        });
    });

    // Todo: set 2Factor through api.
  };

  return (
    <form
      className="text-white bg-gray-900 h-screen flex flex-col"
      onSubmit={handleSubmitForm}
    >
      <h1>Choose your nickname</h1>
      <input
        type="text"
        name="nickname"
        value={nickname}
        onChange={(e) => setNickName(e.target.value)}
        placeholder="Choose your nickname"
        className="text-gray-900 placeholder:text-gray-400 outline_none rounded-xl"
      />
      {nickname.length > MAX_CHAR ? (
        <label className="text-yellow-400">
          * Nickname can't be over {MAX_CHAR} characters
        </label>
      ) : (
        ""
      )}
      {/* Should I add something to pre-display the photo? */}
      <img
        src="https://img.lemde.fr/2019/05/17/0/0/3553/2542/664/0/75/0/74a2a9f_91ae3c37d18b44d4ae49147a7b9a2126-91ae3c37d18b44d4ae49147a7b9a2126-0.jpg"
        alt="random_avatar"
        className="w-80 rounded-full"
      />
      <h1>Choose your avatar</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <span>Activate Two-Factor Authentication</span>
      <select value={twoFactor} 
      onChange={(e) => setTwoFactor(e.target.value)}
      className="text-gray-800">
        <option value="false">false</option>
        <option value="true">true</option>
      </select>
      <button type="submit"> Submit all</button>
      <p>{nickname}</p>
      <p>{twoFactor}</p>
    </form>
  );
};

export default SignInPage;
