import { PictureSetter } from "./PictureSetter";
import { PictureGetter } from "./PictureGetter";
import { Api } from "../../api/api";

const api = new Api();

export const PictureForm = () => {
  return (
    <div>
      <PictureSetter />
      <PictureGetter apiCall={() => api.getPicture()} />
    </div>
  );
};
