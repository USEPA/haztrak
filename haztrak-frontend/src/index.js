import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router} from "react-router-dom";
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'bootstrap/dist/js/bootstrap.min'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Router>
    <App/>
  </Router>
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals()
