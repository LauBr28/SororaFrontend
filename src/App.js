import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import LoginForm from "./components/LoginForm";
import Inicio from './components/Inicio';
import Home from './components/Home';
import Profile from './components/Profile';
import Mapa from './components/Mapa';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/loginForm" element={<LoginForm/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/mapa" element={<Mapa/>}/>
          <Route path="/create-post" element={<CreatePost/>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}
export default App;