import { useState } from "react";
import { Api } from "../../api/api";

export const PictureSetter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const api = new Api();

  const submitUploadForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedFile) return;
    if (!e) return;

    e.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);

    api.setPicture(formData).catch((err) => alert("File Upload Error"));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <form>
        <input type="file" onChange={handleChange} />
        <button onClick={submitUploadForm}>Upload Avatar</button>
      </form>
    </div>
  );
};
