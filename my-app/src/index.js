import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import Router from "./router";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer theme="dark" position="bottom-left" />
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);
