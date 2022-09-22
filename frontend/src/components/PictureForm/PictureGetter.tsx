import React, { useState } from "react";
type Props = {
  apiCall: () => Promise<Response>;
};

export const PictureGetter: React.FC<Props> = ({ apiCall }) => {
  const [userPicture, setUserPicture] = useState<string | null>(null);

  const submitDownloadForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    apiCall()
      .then((res: Response) => res.blob())
      .then((myBlob: Blob) => setUserPicture(URL.createObjectURL(myBlob)))
      .catch((err: Error) => alert("File Download Error:" + err));
  };

  return (
    <div>
      <form>
        <h1>React File Download</h1>
        <button onClick={submitDownloadForm}>Submit</button>
      </form>
      <img
        src={userPicture ? userPicture : ""}
        alt="user picture"
        hidden={!!userPicture}
      />
    </div>
  );
};
