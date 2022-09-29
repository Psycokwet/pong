import React, { useEffect } from "react";
import { useState } from "react";
import { Api } from "../../api/api";
import { PictureGetter } from "../PictureForm/PictureGetter";
import NickNameGetter from "../PictureForm/NickNameGetter";
import ProfilePic from "../Common/ProfilePic";
import Switch from "react-switch";
import { MenuItem, Menu, MenuButton, useMenuState, FocusableItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

const MAX_CHAR = 15;

const api = new Api();
const SignInPage = () => {
  const [pongUsername, setPongUsername] = useState<string>("anonymous");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [avatar, setAvatar] = useState("");
  const [checked, setChecked] = useState<boolean>(false);
  const [red, setRed] = useState<boolean>(true);
  const [qrCodeImg, setQrCodeImg] = useState<string>("");
  const [code, setCode] = useState<string>("");

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
    console.log(`twoFactor status is set to: ${checked}`);
  };

  const handlePreviewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    setAvatar(fileURL);
    setSelectedFile(file);
  };
  const submitDownloadForm = (apiCall: () => Promise<Response>) => {
    apiCall()
      .then((res: Response) => res.blob())
      .then((myBlob: Blob) => {
        setQrCodeImg(URL.createObjectURL(myBlob));
      })
      .catch((err: Error) => alert(`File Download Error ${err}`));
  };

  const handleChange = (nextChecked:boolean) => {
    setChecked(nextChecked);
    if (nextChecked) {
      if (qrCodeImg === "")
        submitDownloadForm(() => api.generate_2fa())
      setRed(true);
    }
  };
  return (
    <div className="flex flex-col items-center bg-gray-900 gap-4 h-7/8 text-white">
      <div className="bg-gray-900">
        <ProfilePic avatar={avatar} setAvatar={setAvatar}></ProfilePic>
      </div>
        <div className="flex flex-col self-center items-center">
          <h1>Change your avatar :</h1>
          <input type="file" onChange={handlePreviewPhoto} />
        </div>

        <div className="flex flex-col self-center items-center">
          <h1>Change your pongUsername</h1>
          <input
            type="text"
            name="pongUsername"
            value={pongUsername}
            onChange={(e) => setPongUsername(e.target.value)}
            placeholder={`name less than ${MAX_CHAR} letters`}
            className="bg-gray-600 placeholder:text-gray-400 placeholder:px-4 outline_none rounded-xl w-60 border-4 border-gray-600"
          />
          {pongUsername.length > MAX_CHAR ? (
            <label className="text-yellow-400">
              * Nickname can't be over {MAX_CHAR} characters
            </label>
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-row gap-2">
          <span>Enable Two-Factor Authentication : </span>
          <div className="example">
            <label>
            </label>
            <Menu menuButton={
              <MenuButton><Switch
                onChange={()=>{}}
                checked={checked}
                className="react-switch"
                onColor={(red ? "#bc391c" : "#0cb92a")}
              /></MenuButton>
              }
              key={"top"}
              position={"anchor"}
              align={"end"}
              direction={"top"}
              arrow={true}
              transition={{open:true, close:true}}
              onMenuChange={(open) =>handleChange(open.open)}
            >
              <MenuItem
                className="items-center"
                disabled={true}>
                <img
                  className="self-center"
                  src={qrCodeImg ? qrCodeImg : ""}
                  alt="user picture"
                  hidden={Boolean(qrCodeImg)}
                />
              </MenuItem>
              <FocusableItem>
                {({ ref }) => (
                  <div className="flex flex-row gap-2">
                    <input ref={ref} type="text" placeholder="Enter Code"
                        value={code} onChange={e => setCode(e.target.value)} />
                    {( if (status===enum.VALIDATE)
                    <button className="border-4 border-gray-400 bg-gray-400 hover:border-gray-300 hover:bg-gray-300 transition rounded-md">Validate</button>
                    )}
                  </div>
                )}
              </FocusableItem>
            </Menu>
          </div>
        </div>

        <button
          type="submit"
          className="w-fit bg-sky-500 hover:bg-sky-700 text-xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        >
          Submit
        </button>

      {/* Testing Zone - to delete later - don't forget to scroll down */}
      {/* <div>
        <PictureGetter />
        <NickNameGetter />
      </div> */}
    </div>
  );
};

export default SignInPage;
