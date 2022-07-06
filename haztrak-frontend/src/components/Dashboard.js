import React from "react";
import {Container} from "react-bootstrap";
import {Route, Routes} from "react-router-dom";
import Sidebar from "./Sidebar";
import Home from "../views/home";
import Profile from "../views/Profile";
import Sites from "../views/Sites";
import Manifest from "../views/Manifest";
import About from "../views/About";

const Dashboard = props => {
  console.log("from Dashboard", props.user)
  return (
    <div id="layoutSidenav">
      <Sidebar user={props.user}/>
      <Container fluid className="p-3 bg-light" id="layoutSidenav_content">
        <Routes>
          <Route
            path="/"
            element={<Home/>}
          />
          <Route
            path="/profile"
            element={<Profile/>}
          />
          <Route
            path="/manifest"
            element={<Manifest/>}
          />
          <Route
            path="/about"
            element={<About/>}
          />
          <Route
            path="/Sites"
            element={<Sites/>}
          />
        </Routes>
      </Container>
    </div>
  )
}

export default Dashboard
