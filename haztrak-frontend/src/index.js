import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router} from "react-router-dom";
import App from './components/App/App';
import store from "./components/App/store";
import {Provider} from "react-redux";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/js/bootstrap.min';

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <Router>
      <App/>
    </Router>
  </Provider>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals()
