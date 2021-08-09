import React from "react";

export const DashboardContext = React.createContext({
    kernel: null,
    widgetManager: null,
    showSource: null,
    updateValue: null,
    showNavbarMenuIcon: false,
    onNavbarMenuIconClick: null,
    sidebarOpen: true,
});

export const Provider = DashboardContext.Provider;
export const Consumer = DashboardContext.Consumer;
