import React, { useState } from 'react'

export default function ConnectedUsers({connectedUserIdList}:{connectedUserIdList:number[]}) {
  return (
    <>
      <h4>Connected User's ID</h4>
      {
        connectedUserIdList.map((id, index) => {
          return <div key={index}>{id}</div>
        })
      }
    </>
  )
}