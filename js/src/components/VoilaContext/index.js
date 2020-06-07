import React from "react";

const VoilaContext = React.createContext({
    manager: null,
    kernel: null,
    renderWidgets() {},
});

export const Provider = VoilaContext.Provider;
export const Consumer = VoilaContext.Consumer;
