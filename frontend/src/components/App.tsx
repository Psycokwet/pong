import "./App.css";
import NavBar from "./NavBar/NavBar";
import {Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<NavBar />} />
      </Routes>
    </div>
  )
}

export default App;
