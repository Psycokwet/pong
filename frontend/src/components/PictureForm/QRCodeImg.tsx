import React, { useState } from "react";
type QRCodeImgProps = {
  apiCall: () => Promise<Response>;
};

export const QRCodeImg: React.FC<QRCodeImgProps> = ({ apiCall }) => {
  const [userPicture, setUserPicture] = useState<string>("");

  const submitDownloadForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    apiCall()
      .then((res: Response) => res.blob())
      .then((myBlob: Blob) => {
        setUserPicture(URL.createObjectURL(myBlob));
      })
      .catch((err: Error) => alert(`File Download Error ${err}`));
  };

  return (
    <div>
      <button
        onClick={submitDownloadForm}
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
      >
        get QrCode to activate 2 fa !
      </button>
      <img
        src={userPicture ? userPicture : ""}
        alt="user picture"
        hidden={Boolean(userPicture)}
      />
    </div>
  );
};
