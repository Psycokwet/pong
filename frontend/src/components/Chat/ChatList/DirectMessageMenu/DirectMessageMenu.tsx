import { Socket } from "socket.io-client";
import { useState } from "react";

function DirectMessageMenu({ socket }: { socket: Socket | undefined }) {
  const [addChannel, setAddChannel] = useState<boolean>(false);
  return (
    <div className="flex flex-col sticky top-0 px-4 py-3 font-semibold text-xl text-slate-200 bg-slate-700/90 backdrop-blur-sm ring-1 ring-black/10">
      <div
        className={"flex flex-row" + (addChannel ? " cursor-pointer" : "")}
        onClick={() => {
          setAddChannel(!addChannel);
        }}
      >
        <h1 className="grow">Direct Messages</h1>
      </div>
    </div>
  );
}
export default DirectMessageMenu;
