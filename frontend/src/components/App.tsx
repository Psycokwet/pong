import "./App.css";
import NavBar from "./NavBar/NavBar";
import Profile from "./Profile/Profile"
import {Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<NavBar />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App;
