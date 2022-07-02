import React from "react";

const Login = () => {
  return (
    <body className="bg-primary">
    <div id="layoutAuthentication">
      <div id="layoutAuthentication_content">
        <main>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div className="card-header"><h3
                    className="text-center font-weight-light my-4">Login</h3>
                  </div>
                  <div className="card-body">
                    {/*<form>*/}
                    {/*    <div className="form-floating mb-3">*/}
                    {/*        <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com" />*/}
                    {/*        <label for="inputEmail">Email address</label>*/}
                    {/*    </div>*/}
                    {/*    <div className="form-floating mb-3">*/}
                    {/*        <input className="form-control" id="inputPassword" type="password" placeholder="Password" />*/}
                    {/*        <label for="inputPassword">Password</label>*/}
                    {/*    </div>*/}
                    {/*    <div className="form-check mb-3">*/}
                    {/*        <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />*/}
                    {/*        <label className="form-check-label" for="inputRememberPassword">Remember Password</label>*/}
                    {/*    </div>*/}
                    {/*    <div className="d-flex align-items-center justify-content-between mt-4 mb-0">*/}
                    {/*        <a className="small" href="password.html">Forgot Password?</a>*/}
                    {/*        <a className="btn btn-primary" href="index.html">Login</a>*/}
                    {/*    </div>*/}
                    {/*</form>*/}
                  </div>
                  <div className="card-footer text-center py-3">
                    <div className="small"><a href="#">Need an account? Sign
                      up!</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="layoutAuthentication_footer">
        <footer className="py-4 bg-light mt-auto">
          <div className="container-fluid px-4">
            <div
              className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright &copy; Your Website 2022
              </div>
              <div>
                <a href="#">Privacy Policy</a>
                &middot;
                <a href="#">Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </body>
  )
}

export default Login
