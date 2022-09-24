import React, { useState } from 'react'

interface User {
  id: number;
  pongUsername: string;
}

export default function ChannelAttachedUsers(
  {
    channelAttachedUserList,
  }:
  {
    channelAttachedUserList: User[],
  }
  ) {
  return (
    <ul>
      {
        channelAttachedUserList.map((user) =>
          <li key={user.id}>{user.pongUsername}</li>
        )
      }
    </ul>
  )
}