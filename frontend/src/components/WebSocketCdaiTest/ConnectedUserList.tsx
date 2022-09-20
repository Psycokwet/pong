import React, { useState } from 'react'

interface User {
  id: number;
  pongUsername: string;
}

export default function ConnectedUserList(
  {
    connectedUsers,
  }:
  {
    connectedUsers: User[],
  }
  ) {
  return (
    <ul>
      {
        connectedUsers.map((user) =>
          <li key={user.id}>{user.pongUsername}</li>
        )
      }
    </ul>
  )
}