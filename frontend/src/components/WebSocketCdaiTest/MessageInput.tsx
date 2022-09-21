import React, { KeyboardEvent, useState } from "react";

export default function MessageInput({
  send,
}: {
  send: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Enter" && value !== "") {
      send(value);
      setValue("");
    }
  };

  return (
    <>
      <input
        placeholder="type your message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => send(value)}>Send</button>
    </>
  );
}
