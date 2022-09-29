import React from 'react'

export const DEFAULT_AVATAR: string =
  "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg";

type AvatarProps = {
  url: string;
};

const Avatar: React.FC<AvatarProps> = ({ url }) => {
  return (
    <div className="bg-gray-900">
      {url ? (
        <img src={url} className="w-40 rounded-full" />
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

export default Avatar