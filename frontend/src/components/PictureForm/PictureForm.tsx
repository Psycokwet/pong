import { useState } from "react";
import { PictureSetter } from "./PictureSetter";
import { PictureGetter } from "./PictureGetter";

export const PictureForm = () => {
  return (
    <div>
      <PictureSetter/>
      <PictureGetter/>
    </div>
  );
}

