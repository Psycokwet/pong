import { Status } from "/shared/interfaces/UserStatus";

export type UserStatus = {
  status: Status;
  color: string;
  groupName: string;
};
export const statusList: UserStatus[] = [
  {
    status: Status.ONLINE,
    color: "text-green-400",
    groupName: "Online",
  },
  {
    status: Status.PLAYING,
    color: "text-yellow-400",
    groupName: "Playing",
  },
  {
    status: Status.OFFLINE,
    color: "text-red-500",
    groupName: "Offline",
  },
];
