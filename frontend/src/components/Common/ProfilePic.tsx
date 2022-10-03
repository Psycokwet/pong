import React, { useEffect } from "react";
import { Api } from "../../api/api";

const DEFAULT_AVATAR: string =
  "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg";

type ProfilePicProps = {
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>; // I guess we will need to add some props for size adaptation :)
};

const api = new Api();
const ProfilePic: React.FC<ProfilePicProps> = ({ avatar, setAvatar }) => {
  useEffect(() => {
    api
      .getPicture(null)
      .then((res) => {
        if (res.status == 200)
          res.blob().then((myBlob) => {
            setAvatar((current) => {
              if (current) URL.revokeObjectURL(current); // to avoid memory leaks
              return URL.createObjectURL(myBlob);
            });
          });
      })
      .catch((err) => alert(`File Download Error ${err}`));
  }, []);
  return (
    <div className="bg-gray-900">
      {avatar ? (
        <img src={avatar} className="w-40 rounded-full" />
      ) : (
        <img
          src={DEFAULT_AVATAR}
          alt="Preview selected photo"
          className="w-40 rounded-full"
        />
      )}
    </div>
  );
};

export default ProfilePic;
