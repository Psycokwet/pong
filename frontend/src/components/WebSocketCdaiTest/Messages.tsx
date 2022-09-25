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
      messages.map((message) => {
        const dateTime = new Intl.DateTimeFormat('en-EN', {
          dateStyle: 'full',
          timeStyle: 'long'
        })
          .format(new Date(message.time));
          
        return <div key={message.id}>
          <h6>{message.author}: {dateTime}</h6>
          <p>{message.content}</p>
        </div>
      })
    }</>
  )
}