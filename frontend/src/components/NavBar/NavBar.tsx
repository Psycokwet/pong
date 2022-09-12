import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './Pages-To-Change/Home'
import Play from './Pages-To-Change/Play'
import LeaderBoard from './Pages-To-Change/LeaderBoard'
import Community from './Pages-To-Change/Community'
import User from './Pages-To-Change/User'
import NotFound from './Pages-To-Change/NotFound'

const NavBar = () => {
  return (
    <div>
      <nav className='fixed w-full flex justify-between p-4 items-center'>
        <ul className='md:flex gap-8 p-6 uppercase'>
          <li><NavLink to="/" style={({isActive}) => ({color: isActive? "blue": "black"})}>Pong's Game</NavLink></li>
          <li><NavLink to="/play" style={({isActive}) => ({color: isActive? "blue": "black"})}>Play</NavLink></li>
          <li><NavLink to="/leaderboard" style={({isActive}) => ({color: isActive? "blue": "black"})}>Leader Board</NavLink></li>
          <li><NavLink to="/community" style={({isActive}) => ({color: isActive? "blue": "black"})}>Comunity</NavLink></li>
          <li><NavLink to="/user" style={({isActive}) => ({color: isActive? "blue": "black"})}>User</NavLink></li>
        </ul>
      </nav>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} /> // ? component Play will be render when we're at site.com/play
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/user" element={<User />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default NavBar