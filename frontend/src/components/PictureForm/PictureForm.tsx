import { useState } from "react";

// const [name, setName] = useState("");


export const PictureForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [userPicture, setUserPicture] = useState(null);

  const submitUploadForm = (e) => {
    e.preventDefault();
    console.log(e)
    const formData = new FormData();
    formData.append("file", selectedFile);

    console.log(selectedFile, formData)
    fetch(
      'http://localhost:8080/api/user/set_avatar', {
        headers: {
          authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNkYWkiLCJzdWIiOjEsImlhdCI6MTY2MzEwMTgxOCwiZXhwIjoxNjYzMTg4MjE4fQ.jkSNqaF0xSJ8JKdJT7Fs8llWE7Is0P-UCpb7a3crOd0",
        },
        method: 'post',
        body: formData
      })
      .then((res) => {
        alert("File Upload success");
      })
      .catch((err) => alert("File Upload Error"));
  };

  function handleChange(event) {
    console.log(event, event.target.files[0])
    setSelectedFile(event.target.files[0])
    console.log(selectedFile)
  }

  const submitDownloadForm = (e) => {
    e.preventDefault()

    fetch(
      'http://localhost:8080/api/user/get_picture', {
        headers: {
          authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNkYWkiLCJzdWIiOjEsImlhdCI6MTY2MzEwMTgxOCwiZXhwIjoxNjYzMTg4MjE4fQ.jkSNqaF0xSJ8JKdJT7Fs8llWE7Is0P-UCpb7a3crOd0",
        },
        method: 'get',
      })
      .then((res) => {
        alert("File Download success");
        return res.blob()
      })
      .then(myBlob => {
        const objectURL = URL.createObjectURL(myBlob);
        // myImage.src = objectURL;
        setUserPicture(objectURL);
      })
      .catch((err) => alert("File Download Error"));
  }

  return (
    <div>
      <form>
        <h1>React File Upload</h1>
          <input type="file" onChange={handleChange}/>
        <button onClick={submitUploadForm}>Submit</button>
      </form>

      

      <form>
        <h1>React File Download</h1>
        <button onClick={submitDownloadForm}>Submit</button>
      </form>
      <img src={userPicture} alt="" hidden={!!userPicture} />
    </div>
  );
}

