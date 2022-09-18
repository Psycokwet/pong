import { useState } from "react";
import { Api } from '../../api/api';

export const PictureGetter = () => {
  const [userPicture, setUserPicture] = useState<string | null>(null);

  const api = new Api();
  
  const bearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNkYWk1Iiwic3ViIjoyLCJpYXQiOjE2NjMxNDc1ODMsImV4cCI6MTY2MzIzMzk4M30.VCaaZkl991iMz8TQeeXnJqxDpKu4QfeowFKgiRSiZ3k'

  api.setToken(bearer);

  const submitDownloadForm = (e) => {
    e.preventDefault()

    api.getPicture()
      .then(res => res.blob())
      .then(myBlob => setUserPicture(URL.createObjectURL(myBlob)))
      .catch((err) => alert("File Download Error"));
  }

  return (
    <div>
      <form>
        <h1>React File Download</h1>
        <button onClick={submitDownloadForm}>Submit</button>
      </form>
      <img src={userPicture ? userPicture : ''} alt="user picture" hidden={!!userPicture} />
    </div>
  );
}

