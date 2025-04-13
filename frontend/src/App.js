
import logo from './logo.svg';
import './App.css';
import {
  Route,
  Routes,
 
} from "react-router-dom";
//import pagegs
import UserForm from './pages/userForm';
import Home from './pages/home';

function App() {
return(
  <div>
      <Routes>      
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<UserForm/>} />
        </Routes>
  </div>
)
}

export default App;
