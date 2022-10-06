import { MenuItem } from '@szhsin/react-menu';
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { Socket } from "socket.io-client";

const Block = ({
  socket,
  user,
}:{
  socket: Socket | undefined;
  user: ChannelUserInterface;
})=>{
  const blockfunction = () => {
    socket?.emit(ROUTES_BASE.USER.BLOCK_USER_REQUEST, {id:user.id});
  }
  return (
    <MenuItem>
      <div onClick={blockfunction}>Block</div>
    </MenuItem>
  );
}

export default Block
