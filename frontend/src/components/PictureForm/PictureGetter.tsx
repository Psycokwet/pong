import { useState } from "react";
import { Api } from "../../api/api";
const api = new Api();

export const PictureGetter = () => {
  const [userPicture, setUserPicture] = useState<string>("");

  const submitDownloadForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    api
      .getPicture(null)
      .then((res) => res.blob())
      .then((myBlob) => {
        setUserPicture(URL.createObjectURL(myBlob));
        console.log("get_picture is Ok");
      })
      .catch((err) => alert(`File Download Error ${err}`));
  };

  return (
    <div>
      <button
        onClick={submitDownloadForm}
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
      >
        View Uploaded Photo:{" "}
      </button>
      <img
        src={userPicture ? userPicture : ""}
        alt="user picture"
        hidden={Boolean(userPicture)}
        className="w-40 rounded-full"
      />
    </div>
  );
};
