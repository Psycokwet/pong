import { Status } from "./UserStatus";
export interface UserInterface {
  id: number;
  pongUsername: string;
  status: Status;
  image_url: string; //USED BUT NEVER SET ?????? ERRORTSC
}
