import TopNav from "./components/TopNav";
import {Route, Routes} from "react-router-dom";
import './App.css';
import Dashboard from "./components/layouts/Dashboard";

function App() {
  return (
    <div className="App">
      <TopNav/>
      <Routes>
        <Route
          path="/"
          element={<Dashboard/>}
        />
        <Route
          path="/"
          element={<Dashboard/>}
        />
      </Routes>
    </div>
  );
}

export default App;
