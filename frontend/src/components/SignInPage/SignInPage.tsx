import React, { useEffect } from "react";
import { useState } from "react";
import { Api } from "../../api/api";
import { PictureGetter } from "../PictureForm/PictureGetter";
import NickNameGetter from "../PictureForm/NickNameGetter";
import ProfilePic from "../Common/ProfilePic";

const MAX_CHAR = 15;

const api = new Api();
const SignInPage = () => {
  const [pongUsername, setPongUsername] = useState<string>("anonymous");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [avatar, setAvatar] = useState("");
  const [twoFactor, setTwoFactor] = useState("off");

  useEffect(() => {
    api.get_pong_username().then((res: Response) => {
      res.json().then((content) => {
        setPongUsername(content.pongUsername);
      });
    });
  }, []);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    if (event === undefined) return; //not sure it may happen
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

    if (pongUsername.length <= MAX_CHAR) {
      api.set_pong_username(pongUsername).then((res: Response) => {
        if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
          console.log("set pongUsername is NOT Ok");
        else console.log(`Set pongUsername is ok, status is: ${res.status}`);
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

  return (
    <div>
      <div className="bg-gray-900">
        <ProfilePic avatar={avatar} setAvatar={setAvatar}></ProfilePic>
      </div>

      <form
        className="text-white bg-gray-900 h-screen flex flex-col"
        onSubmit={handleSubmitForm}
      >
        <h1>Change your avatar</h1>
        <input type="file" onChange={handlePreviewPhoto} />

        <h1>Change your pongUsername</h1>
        <input
          type="text"
          name="pongUsername"
          value={pongUsername}
          onChange={(e) => setPongUsername(e.target.value)}
          placeholder={`name less than ${MAX_CHAR} letters`}
          className="text-gray-900 placeholder:text-gray-400 placeholder:px-4 outline_none rounded-xl w-60"
        />
        {pongUsername.length > MAX_CHAR ? (
          <label className="text-yellow-400">
            * Nickname can't be over {MAX_CHAR} characters
          </label>
        ) : (
          ""
        )}

        <div className="flex flex-row">
          <span>Activate Two-Factor Authentication</span>
          <select
            onChange={(e) => setTwoFactor(e.target.value)}
            className="text-gray-800 mx-4"
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-fit bg-sky-500 hover:bg-sky-700 text-xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        >
          Submit
        </button>
      </form>

      {/* Testing Zone - to delete later - don't forget to scroll down */}
      <div>
        <PictureGetter />
        {/* <NickNameGetter /> */}
      </div>
    </div>
  );
};

export default SignInPage;
