import './App.css';
import Sidebar from "./components/sidebar";
import TopNav from "./components/topnav";

function App() {
  return (
    <div className="App">
      <TopNav/>
      <div id="layoutSidenav">
        <Sidebar/>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">Dashboard</h1>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-primary text-white mb-4">
                    <div className="card-body">Primary Card</div>
                    <div
                      className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View
                        Details</a>
                      <div className="small text-white"><i
                        className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-warning text-white mb-4">
                    <div className="card-body">Warning Card</div>
                    <div
                      className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View
                        Details</a>
                      <div className="small text-white"><i
                        className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-success text-white mb-4">
                    <div className="card-body">Success Card</div>
                    <div
                      className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View
                        Details</a>
                      <div className="small text-white"><i
                        className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-danger text-white mb-4">
                    <div className="card-body">Danger Card</div>
                    <div
                      className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">View
                        Details</a>
                      <div className="small text-white"><i
                        className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
