import { useState } from "react";
import { Api } from '../../api/api';

export const PictureGetter = () => {
  const [userPicture, setUserPicture] = useState<string | null>(null);

  const api = new Api();

  const submitDownloadForm = (e) => {
    e.preventDefault()

    api.getPicture()
      .then(res => res.blob())
      .then(myBlob => setUserPicture(URL.createObjectURL(myBlob)))
      .catch((err) => alert(`File Download Error ${err}`));
  }

  return (
    <div>
      <form>
        <button onClick={submitDownloadForm}>View Uploaded Photo</button>
      </form>
      <img src={userPicture ? userPicture : ''} alt="user picture" hidden={!!userPicture} />
    </div>
  );
}

