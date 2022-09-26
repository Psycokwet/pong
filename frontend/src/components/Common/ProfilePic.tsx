const DEFAULT_AVATAR: string =
  "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg";

type Props = {
  avatar: string;
};

const ProfilePic: React.FC<Props> = ({ avatar }) => {
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
