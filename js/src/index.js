import JupyterFlex from "./App";
export default JupyterFlex;

// Exported for downstream deps (NBViewer.JS)
import DashboardCell from "./Cell";
import Widget from "./Cell/widget";
import { Provider, Consumer } from "./App/context";

export { DashboardCell, Widget };
export { Provider as DashboardProvider };
export { Consumer as DashboardConsumer };

import "./styles/index.scss";
