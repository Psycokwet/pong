import React, { useEffect } from "react";
import { useState } from "react";
import { Api } from "../../api/api";
import { PictureGetter } from "../PictureForm/PictureGetter";
import NickNameGetter from "../PictureForm/NickNameGetter";

const MAX_CHAR = 5;

const SignInPage = () => {
  const [nickname, setNickName] = useState("thi-nguy"); // Todo : get 42login and put it as initial value
  const [selectedFile, setSelectedFile] = useState<File>();
  const [avatar, setAvatar] = useState(""); // Todo: need a route for default photo
  const [twoFactor, setTwoFactor] = useState("off");

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    const api = new Api();
    if (event === undefined) return;
    event.preventDefault();

    const fileData = new FormData();
    if (selectedFile) {
      fileData.append("file", selectedFile);
      api.setPicture(fileData).then((res: Response) => {
        if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
          console.log("set picture is NOT Ok");
        else console.log(`Set picture is ok, status is: ${res.status}`);
      });
    }

    if (nickname.length <= MAX_CHAR) {
      api.set_nickname(nickname).then((res: Response) => {
        if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
          console.log("set nickname is NOT Ok");
        else console.log(`Set nickname is ok, status is: ${res.status}`);
      });
    }

    // Todo: set 2Factor through api.
    console.log(`twoFactor status is set to: ${twoFactor}`);
  };

  const handlePreviewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    setAvatar(fileURL);
    setSelectedFile(file);
  };

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar);
    };
  }, [avatar]); // to avoid memory leaks

  return (
    <div>
      <div className="bg-gray-900">
        {avatar ? (
          <img src={avatar} className="w-40 rounded-full" />
        ) : (
          <img
            src="https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
            alt="Preview selected photo"
            className="w-40 rounded-full"
          />
        )}
      </div>

      <form
        className="text-white bg-gray-900 h-screen flex flex-col"
        onSubmit={handleSubmitForm}
      >
        <h1>Change your avatar</h1>
        <input type="file" onChange={handlePreviewPhoto} />

        <h1>Change your nickname</h1>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickName(e.target.value)}
          placeholder={`name less than ${MAX_CHAR} letters`}
          className="text-gray-900 placeholder:text-gray-400 placeholder:px-4 outline_none rounded-xl w-60"
        />
        {nickname.length > MAX_CHAR ? (
          <label className="text-yellow-400">
            * Nickname can't be over {MAX_CHAR} characters
          </label>
        ) : (
          ""
        )}

        <div className="flex flex-row">
          <span>Activate Two-Factor Authentication</span>
          <input
            type="checkbox"
            onChange={(e) => setTwoFactor(e.target.value)}
            className="text-gray-800 mx-4"
          ></input>
        </div>

        <button
          type="submit"
          className="w-fit bg-sky-500 hover:bg-sky-700 text-xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        >
          {""}
          Submit
        </button>
      </form>

      {/* Testing Zone - to delete later - don't forget to scroll down */}
      <div>
        <PictureGetter />
        <NickNameGetter />
      </div>
      {/* ****************************************************** */}
    </div>
  );
};

export default SignInPage;
