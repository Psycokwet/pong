import { MenuItem } from '@szhsin/react-menu';
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";
import { AddFriend } from "/shared/interfaces/AddFriend";


const AddFriendButton = ({
  socket,
  user,
}:{
  socket: Socket|undefined;
  user: UserInterface;
})=>{
  const handleAddFriend = () => {
    const addFriend: AddFriend = {
      pongUsername: user.pongUsername
    }
    socket?.emit(ROUTES_BASE.USER.ADD_FRIEND_REQUEST, addFriend);
  }
  return (
    <MenuItem onClick={handleAddFriend}>
      Add as Friend
    </MenuItem>
  );
}

export default AddFriendButton
