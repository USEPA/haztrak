import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import './App.css'
import {history} from './_helpers';
import {PrivateRoute} from './_components';
import {Home} from './home';
import {Login} from './login';
import TopNav from "./_components/TopNav";
import {Container} from "react-bootstrap";
import Sidebar from "./_components/Sidebar";
import About from "./_components/About";

export {App};

function App() {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  return (
    <div className="App">
      <TopNav/>
      <div id="layoutSidenav">
        <Sidebar/>
        <Container fluid className="" id="layoutSidenav_content">
          <Routes>
            <Route path="/"
                   element={
                     <PrivateRoute>
                       <Home/>
                     </PrivateRoute>
                   }
            />
            <Route path="/login" element={<Login/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </Container>
      </div>
    </div>
  );
}
