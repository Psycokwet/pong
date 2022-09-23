import React from 'react'
import { useState } from 'react'
import { PictureSetter } from '../PictureForm/PictureSetter'

const SignInPage = () => {
    const [inputValue, setInputValue] = useState("")
  return (
    <form className='text-white bg-gray-900 h-screen flex flex-col'>
        <h1>Choose your nickname</h1>
        <input 
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Choose your nickname"
        className="text-gray-900 placeholder:text-gray-400 outline_none rounded-xl"
        />
        <h1>Default Avatar</h1>
        <h1>Choose your avatar</h1>
        <PictureSetter/>
        <input
        type="checkbox" /> Activate Two-Factor Authentication
        
         
    </form>
  )
}

export default SignInPage