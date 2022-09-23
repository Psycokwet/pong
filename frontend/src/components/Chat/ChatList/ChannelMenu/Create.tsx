import { useState } from "react";

function Create ()  {
  const [newChanName, setNewChanName] = useState<string>("");
  const [newChanPass, setNewChanPass] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  return (
    <>
          <div className="flex flex-col gap-1 text-base font-light">
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Serveur Name"
              value={newChanName}
              onChange={(e) => {
                setNewChanName(e.target.value);
              }}
            ></input>
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Password (optionnal)"
              value={newChanPass}
              onChange={(e) => {
                setNewChanPass(e.target.value);
              }}
            ></input>
            <div className="flex flex-row gap-4 px-6">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => { setIsPrivate(e.target.checked) }}></input>
              <h3>Private</h3>
            </div>
          </div>
    </>
  )
}

export default Create
