import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import App2 from "./App2";
//import Hoc from "./HOC";
//import RenderProp from "./renderprops";
//import HOC2 from "./HOC2";
import App from "./App";
//import Sudi from "./3107";
//import Counter from "./Stopwatch";
//import Example from "./Example";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
