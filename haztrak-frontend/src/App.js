import './App.css';
import Sidebar from "./components/sidebar";
import TopNav from "./components/topnav";
import Dashboard from "./components/Dashboard"
import Profile from "./components/Profile";
import {Routes, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <TopNav/>
      <div id="layoutSidenav">
        <Sidebar/>
        <div id="layoutSidenav_content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard/>}
            />
            <Route
              path="/profile"
              element={<Profile/>}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
