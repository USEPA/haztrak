import TopNav from "../components/TopNav";
import {Route, Routes} from "react-router-dom";
import './App.css';
import Dashboard from "../components/Dashboard";
import Login from "../views/Login";
import Signup from "../views/Signup";
import {useState} from "react";
import UserService from "../services/User";

const App = props => {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState("")

  async function login(user = null) {
    UserService.login(user)
      .then(function (response) {
        setToken(response.data.token)
        setUser(user.username)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', user.username)
        setError('')
      })
      .catch(e => {
        console.log(e)
        setError(e.toString())
      })
  }

  async function logout() {
    setToken('')
    setUser('')
    localStorage.setItem('token', '')
    localStorage.setItem('user', '')
  }

  console.log("from app", user)

  return (
    <div className="App">
      <TopNav user={user} logout={logout}/>
      <Routes>
        <Route
          path="*"
          element={<Dashboard user={user}/>}
        />
        <Route
          path="/login"
          element={<Login {...props} login={login}/>}
        />
        <Route
          path="/signup"
          element={<Signup/>}
        />
      </Routes>
    </div>
  );
}

export default App;
