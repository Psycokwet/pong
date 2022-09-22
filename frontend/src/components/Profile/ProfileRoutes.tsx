import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Profile from './Profile'
import NotFound from '../NavBar/Pages-To-Change/NotFound'
import { userStatusEnum } from '../FriendList/FriendList'

/**************************************************
 * I guess this is the kind of data we'll get from
 * backend / database through api ?! To DELETE later.
 **************************************************/
 const UserFriendList = [
    {
      login: "scarboni",
      nickname: "scarboniiii",
      status: userStatusEnum.Online,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "scarboni1",
      nickname: "scarboni1234",
      status: userStatusEnum.Playing,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "cdai",
      nickname: "cdai11",
      status: userStatusEnum.Offline,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "cdai1",
      nickname: "cdai1234",
      status: userStatusEnum.Online,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "nader",
      nickname: "nader322",
      status: userStatusEnum.Playing,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "nader1",
      nickname: "nader1432",
      status: userStatusEnum.Offline,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "moot",
      nickname: "moot234",
      status: userStatusEnum.Offline,
      image_url: "https://picsum.photos/400",
    },
    {
      login: "moot1",
      nickname: "moot1123",
      status: userStatusEnum.Online,
      image_url: "https://picsum.photos/400",
    },
  ];

const ProfileRoutes = () => {
  return (
    <Routes location="/profile">
    {UserFriendList.map((one_friend) => {
      return (
        <Route
          key={one_friend.login}
          path={":user_login"}
          element={<Profile />}
        />
      );
    })}
    {/* <Route path="*" element={<NotFound />} /> */}
  </Routes>
  )
}

export default ProfileRoutes