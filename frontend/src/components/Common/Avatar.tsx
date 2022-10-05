import React from 'react'

export const DEFAULT_AVATAR: string =
  "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg";

type AvatarProps = {
  url: string | undefined;
  size: string
};

const Avatar: React.FC<AvatarProps> = ({ url, size }) => {
  return (
    <div className="bg-opacity-0">
      {url ? (
        <img src={url} className={`rounded-full object-cover ${size}`} />
      ) : (
        <img
          src={DEFAULT_AVATAR}
          alt="Preview selected photo"
          className={`rounded-full ${size}`} 
        />
      )}
    </div>
  );
};

export default Avatar