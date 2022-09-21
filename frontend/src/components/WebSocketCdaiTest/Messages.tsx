import React, { useState } from 'react'

interface Message {
  id: number;
  author: string,
  time: Date,
  content: string,
}

export default function Messages({messages}:{messages:Message[]}) {
  return (
    <>{
      messages.map((message, index) => {
        return <div key={message.id}>
          <h6>{message.author}: {message.time.toString()}</h6>
          <p>{message.content}</p>
        </div>
      })
    }</>
  )
}