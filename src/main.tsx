/**
 * @fileoverview Main entry point for Hien Le's portfolio application
 * @copyright Copyright (c) 2025 Hien Le. All rights reserved.
 * @license MIT
 */

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "@private-styling/index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
