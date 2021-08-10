import React from "react";

export const DashboardContext = React.createContext({
    kernel: null,
    widgetManager: null,
    showSource: null,
    updateValue: null,
    sidebarOpen: true,
    sidebarLocal: null,
    sidebarLocalExists: false,
    sidebarGlobalExists: false,
    onNavbarMenuIconClick: null,
});

export const Provider = DashboardContext.Provider;
export const Consumer = DashboardContext.Consumer;
