import React, { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
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
const enum validForm {
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
  const [validFormStatus, setValidFormStatus] = useState<number>(validForm.BUTTON);

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
    let should_update:boolean = false;

    const fileData = new FormData();
    if (selectedFile) {
      fileData.append("file", selectedFile);
      await api.setPicture(fileData).then((res: Response) => {
        if (res.status >= 200 && res.status < 300) {
          toast.success("Oh this is a nice new profile pic :D");
          should_update = true;
        } else toast.error("Sorry, your picture couldn't be uploaded");
      });
    }

    if (
      localPongUsername.length <= MAX_CHAR &&
      localPongUsername != pongUsername
    ) {
      await api.set_pong_username(localPongUsername).then((res: Response) => {
        if (res.status >= 200 && res.status < 300) {
          toast.success(
            "Hello " +
              localPongUsername +
              " ! Nice to get to know you better :D"
          );
          should_update = true;
        } else toast.error("Sorry, your new username hasn't been accepted");
      });
    }

    if (should_update && updateCurrentUser) {
      setValidFormStatus(validForm.DONE);
      updateCurrentUser();
    }
    else {
      setValidFormStatus(validForm.ERROR);
    }
  };
  useEffect(() => {
    if (validFormStatus === validForm.LOADING) {
      const fun = handleSubmitForm;
      fun()
      .catch(console.error)
    }
  }, [validFormStatus]);

  const handlePreviewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    setAvatar(fileURL);
    setSelectedFile(file);
    setValidFormStatus(validForm.BUTTON);
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
  }
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
            value={localPongUsername}
            onChange={(e) => { setValidFormStatus(validForm.BUTTON); setLocalPongUsername(e.target.value)}}
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
            checked={true}
            className="react-switch transition"
            onColor="#0cb92a"
          />
          }
        </div>

        <ButtonSubmit validFormStatus={validFormStatus} setValidFormStatus={setValidFormStatus}/>

    </div>
  );
};

export default SignUpPage;
