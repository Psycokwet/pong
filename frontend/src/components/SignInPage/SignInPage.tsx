import React, { useEffect } from "react";
import { useState } from "react";
import { Api } from "../../api/api";

const MAX_CHAR = 20;
const DEFAULT_PHOTO = "abc";

const SignInPage = () => {
  const [nickname, setNickName] = useState("thi-nguy"); // Todo : get 42login and put it as initial value
  const [selectedPhoto, setPhoto] = useState<File>();
  const [twoFactor, setTwoFactor] = useState("false");
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [avatar, setAvatar] = useState();

  const handleSubmitForm = (event: Event) => {
    const api = new Api();
    event.preventDefault();

    const fileData = new FormData();
    if (selectedPhoto) {
      fileData.append("file", selectedPhoto);
      api.setPicture(fileData).then((res: Response) => {
        if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
          console.log("set picture is not Ok");
        else console.log(`Set picture is ok, status is: ${res.status}`);
      });
    }

    api.set_nickname(nickname).then((res: Response) => {
      console.log("set_nickname is ok", res);
      if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
        res.json().then((content) => {
          console.log("set_nickname", content);
        });
    });

    /****************************************************
     * For testing in the console, to delete later
     * Notes: it gets the current nickname, not the newly set one)
     ****************************************************/
    api.get_nickname("scarboni").then((res: Response) => {
      console.log("get_nickname", res);
      res.json().then((content) => {
        console.log("get_nickname is ok, result:", content);
      });
    });
    /******************************************************************* */

    // Todo next: set 2Factor through api.
  };

  useEffect(() => {
    return () => { avatar && URL.revokeObjectURL(avatar.preview)}
  }, [avatar])


  const handlePreviewPhoto = (e: Event) => {
    const file = e.target.files[0];

    file.preview = URL.createObjectURL(file);
    setAvatar(file);
  };

  const getPhoto = (event: Event) => {
    const api = new Api();
    event.preventDefault();
    api
      .getPicture()
      .then((res) => res.blob())
      .then((myBlob) => setUserPicture(URL.createObjectURL(myBlob)))
      .catch((err) => alert(`File Download Error: ${err}`));
  };

  return (
    <div>
      <form>
        <button onClick={getPhoto}>View uploaded photo</button>
      </form>
      <img
        className="w-80 rounded-full"
        src={userPicture ? userPicture : ""}
        hidden={!!userPicture}
        alt="random_avatar"
      />

      <div>
        <div>Preview selected photo</div>
        {avatar && <img src={avatar.preview} className="w-80 rounded-full" />}
      </div>

      <form
        className="text-white bg-gray-900 h-screen flex flex-col"
        onSubmit={handleSubmitForm}
      >
        {/* Should I add something to pre-display the photo? */}
        <h1>Choose your avatar</h1>
        <input type="file" onChange={handlePreviewPhoto} />

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

        <span>Activate Two-Factor Authentication</span>
        <select
          value={twoFactor}
          onChange={(e) => setTwoFactor(e.target.value)}
          className="text-gray-800"
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>

        <button type="submit"> Submit all</button>

        <p>{nickname}</p>
        <p>{twoFactor}</p>
      </form>
    </div>
  );
};

export default SignInPage;
