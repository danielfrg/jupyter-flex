import React from "react";

export const DashboardContext = React.createContext({
    kernel: null,
    widgetManager: null,
    showCardSource: null,
});

export const Provider = DashboardContext.Provider;
export const Consumer = DashboardContext.Consumer;
