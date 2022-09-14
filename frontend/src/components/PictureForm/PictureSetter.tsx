import { useState } from "react";
import { Api } from "../../api/api";

export const PictureSetter = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const api = new Api();
  
  const bearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNkYWk1Iiwic3ViIjoyLCJpYXQiOjE2NjMxNDc1ODMsImV4cCI6MTY2MzIzMzk4M30.VCaaZkl991iMz8TQeeXnJqxDpKu4QfeowFKgiRSiZ3k'

  api.setToken(bearer);
  
  const submitUploadForm = (e: Event) => {
    if (!selectedFile) return ;
    if (!e) return ;

    e.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);
    
    api.setPicture(formData)
      .catch((err) => alert("File Upload Error"));
  };

  const handleChange = event => {
    setSelectedFile(event.target.files[0])
  }

  return (
    <div>
      <form>
        <h1>React File Upload</h1>
        <input type="file" onChange={handleChange}/>
        <button onClick={submitUploadForm}>Submit</button>
      </form>
    </div>
  );
}

