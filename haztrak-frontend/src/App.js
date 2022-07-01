import {Route, Routes} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import Dashboard from "./views/Dashboard"
import Profile from "./views/Profile";
import Manifest from "./components/Manifest";
import About from "./views/About";
import './App.css';
import {Container} from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <TopNav/>
      <div id="layoutSidenav">
        <Sidebar/>
        <Container fluid className="bg-light" id="layoutSidenav_content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard/>}
            />
            <Route
              path="/profile"
              element={<Profile/>}
            />
            <Route
              path="/manifest"
              element={<Manifest/>}
            />
            />
            <Route
              path="/about"
              element={<About/>}
            />
          </Routes>
        </Container>
      </div>
    </div>
  );
}

export default App;
