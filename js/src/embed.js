import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.scss";
import JupyterFlexDashboard from "./Dashboard";

ReactDOM.render(<JupyterFlexDashboard />, document.getElementById("flex-root"));
