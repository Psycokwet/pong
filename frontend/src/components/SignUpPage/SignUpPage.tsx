import React, { useEffect } from "react";
import { useState } from "react";
import { Api } from "../../api/api";
import ProfilePic from "../Common/ProfilePic";
import Button2fa from "./Button2fa";
import ButtonSubmit from "./ButtonSubmit";
import Switch from "react-switch";
import { MenuItem, Menu, MenuButton, FocusableItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

const enum twoFactorSteps {
  BUTTON,
  LOADING,
  DONE,
  ERROR,
}
const MAX_CHAR = 15;

export type SignUpProps = {
  updateCurrentUser: () => void;
  pongUsername: string;
};
const api = new Api();
const SignUpPage: React.FC<SignUpProps> = ({
  updateCurrentUser,
  pongUsername,
}) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [localPongUsername, setLocalPongUsername] = useState(pongUsername);
  const [avatar, setAvatar] = useState("");
  const [checked, setChecked] = useState<boolean>(false);
  const [qrCodeImg, setQrCodeImg] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<number>(twoFactorSteps.BUTTON);

  useEffect(() => {
    setLocalPongUsername(pongUsername);
  }, [pongUsername]);
  useEffect(() => {
    if (status === twoFactorSteps.LOADING) {
      const tmpCode:string = code;
      setCode("");
      api.turn_on_2fa(tmpCode).then((res: Response) => {
        if (res.status === 401)
          setStatus(twoFactorSteps.ERROR);
        if (res.status === 201)
          setStatus(twoFactorSteps.DONE);
      });
    }
    api.get_2fa().then((res: Response) => {
      res.json().then((content) => {
        if (content === true)
          setStatus(twoFactorSteps.DONE);
      });
    });
  }, [status]);

  const handleSubmitForm = async () => {
    let should_update = false;
    console.log(`should_update status is set to: ${should_update}`);

    const fileData = new FormData();
    if (selectedFile) {
      fileData.append("file", selectedFile);
      await api.setPicture(fileData).then((res: Response) => {
        if (res.status >= 200 && res.status < 300) {
          console.log(`Set picture is ok, status is: ${res.status}`);
          should_update = true;
        } else console.log("set picture is NOT Ok");
      });
    }

    if (localPongUsername.length <= MAX_CHAR) {
      await api.set_pong_username(localPongUsername).then((res: Response) => {
        if (res.status >= 200 && res.status < 300) {
          console.log(`Set pongUsername is ok, status is: ${res.status}`);
          should_update = true;
        } else console.log("set pongUsername is NOT Ok");
      });
    }

    if (should_update && updateCurrentUser) updateCurrentUser();
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

  const turnOffTwofa = () => {
    if (status===twoFactorSteps.DONE) {
      setStatus(twoFactorSteps.BUTTON);
      api.turn_off_2fa();
      setChecked(false);
    }
  }
116a8b97-e0bf-44c5-9cb8-80380dadf5a7
  const handleChange = (nextChecked:boolean) => {
    setChecked(nextChecked);
    if (status===twoFactorSteps.DONE)
      setChecked(false);
    if (status===twoFactorSteps.ERROR)
      setStatus(twoFactorSteps.BUTTON);
    if (nextChecked) {
      if (qrCodeImg === "")
        submitDownloadForm(() => api.generate_2fa())
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

        <div classNam116a8b97-e0bf-44c5-9cb8-80380dadf5a7e="flex flex-col self-center items-center">
          <h1>Change your pongUsername</h1>
          <input
            type="text"
            name="pongUsername"
            value={localPongUsername}
            onChange={(e) => setLocalPongUsername(e.target.value)}
            placeholder={`name less than ${MAX_CHAR} letters`}
            className="bg-gray-600 placeholder:text-gray-400 placeholder:px-4 outline_none rounded-xl w-60 border-4 border-gray-600"
          />
          {localPongUsername.length > MAX_CHAR ? (
            <label className="text-yellow-400">
              * Nickname can't be over {MAX_CHAR} characters
            </label>
          ) : (
            ""
          )}
        </div>

        <div className="flex flex-row gap-2">
          <span>Enable Two-Factor Authentication : </span>
          { status!==twoFactorSteps.DONE ?
          <div>
            <Menu menuButton={
              <MenuButton><Switch
                onChange={()=>{}}
                checked={checked || status===twoFactorSteps.DONE}
                className="react-switch"
                onColor={(status!==twoFactorSteps.DONE ? "#bc391c" : "#0cb92a")}
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
                        value={code} onChange={e => {
                          if (status===twoFactorSteps.ERROR)
                            setStatus(twoFactorSteps.BUTTON);
                          setCode(e.target.value)
                        }} />
                    <Button2fa status={status} setStatus={setStatus}/>
                  </div>
                )}
              </FocusableItem>
            </Menu>
          </div>
          :
          <Switch
            onChange={turnOffTwofa}
            checked={checked}
            className="react-switch transition"
            onColor="#0cb92a"
          />
          }
        </div>

        <ButtonSubmit />
        <button
          type="submit"
          className="border-4 border-gray-400 bg-gray-400 hover:border-gray-300 hover:bg-gray-300 transition rounded-md"
          onClick={handleSubmitForm}
        >
          Submit modifications
        </button>

    </div>
  );
};

export default SignUpPage;
