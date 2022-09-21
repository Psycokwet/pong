import React, { useState } from 'react'

export default function Messages({messages}:{messages:string[]}) {
  return (
    <>{
      messages.map((message, index) => {
        return <div key={index}>{message}</div>
      })
    }</>
  )
}