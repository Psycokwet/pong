import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Position from "/shared/interfaces/Position";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import myConfig from '../../myConfig';

const GameQueue = () => {
  return <div>
    GameQueue
  </div>
} 

export default GameQueue;