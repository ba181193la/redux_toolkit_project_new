
import logo from './logo.svg';
import './App.css';
import {
  Route,
  Routes,
 
} from "react-router-dom";
//import pagegs
import UserForm from './pages/userForm';
import UserDetails from './pages/userDetails';
import Home from './pages/home';
import Login from './pages/login'
import ChatLogin from './pages/chatLogin';
import ChatPage from './pages/chatPage';
import WssExample from './pages/WssExample';
function App() {
return(
  <div>
      <Routes>      
          <Route path="/home" element={<Home/>} />
          {/* <Route path="/WssExample" element={<WssExample/>} /> */}
          <Route path="/" element={<UserForm/>} />
          <Route path="/chatLogin" element={<ChatLogin/>} />
          <Route path="/chat" element={<ChatPage/>} />

          <Route path="/login" element={<UserForm/>} />
          <Route path="/:id" element={<UserForm/>} />
          <Route path="/users" element={<UserDetails/>} />
        </Routes>
  </div>
)
}

export default App;
