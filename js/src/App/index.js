import React from "react";

import IllusionistWidgetManager from "@danielfrg/illusionist";

import { ThemeProvider } from "@material-ui/core/styles";

import theme from "./theme";

import Dashboard from "../Dashboard";
import DashboardErrorBoundary from "./error-boundary";
import { Provider } from "./context";
import { requirePromise } from "../loader";

class JupyterFlex extends React.Component {
    constructor(props) {
        super(props);
        this.appMode = "";

        let { dashboard, pageConfig } = this.props;

        // If dashboard JSON not passed as a prop -> load it from page
        if (!dashboard) {
            const dashboardScriptTag = document.body.querySelector(
                `script[id="jupyter-flex-dashboard"]`
            );
            if (dashboardScriptTag) {
                dashboard = JSON.parse(dashboardScriptTag.innerHTML);
            } else {
                throw new Error(
                    "jupyter-flex: Dashboard JSON not passed as property or found in HTML"
                );
            }
        }

        // If dashboard config JSON not passed as a prop -> load it from page
        if (!pageConfig) {
            const pageConfigScriptTag = document.body.querySelector(
                `script[id="jupyter-config-data"]`
            );
            if (pageConfigScriptTag) {
                pageConfig = JSON.parse(pageConfigScriptTag.innerHTML);
            }
        }

        // Set defaults
        this.appMode =
            pageConfig && pageConfig.kernelId ? "voila" : "nbconvert";

        this.state = {
            pageConfig: pageConfig,
            dashboard: dashboard,
            kernel: null,
            widgetManager: null,
        };
    }

    async componentDidMount() {
        let { widgetManager } = this.props;

        if (widgetManager) {
            this.setState({ widgetManager: widgetManager });
        } else {
            // Create a WidgetManager if not passed as props

            if (this.appMode == "voila") {
                // Load Voila using RequireJS, adapted from:
                // https://github.com/voila-dashboards/voila/blob/master/share/jupyter/voila/templates/base/static/main.js

                requirePromise(["voila"]).then(async (voila) => {
                    const kernel = await voila.connectKernel();

                    const context = {
                        sessionContext: {
                            session: {
                                kernel,
                                kernelChanged: {
                                    connect: () => {},
                                },
                            },
                            statusChanged: {
                                connect: () => {},
                            },
                            kernelChanged: {
                                connect: () => {},
                            },
                            connectionStatusChanged: {
                                connect: () => {},
                            },
                        },
                        saveState: {
                            connect: () => {},
                        },
                    };
                    const settings = {
                        saveState: false,
                    };

                    const rendermime = new voila.RenderMimeRegistry({
                        initialFactories: voila.standardRendererFactories,
                    });

                    const widgetManager = new voila.WidgetManager(
                        context,
                        rendermime,
                        settings
                    );

                    // eslint-disable-next-line no-unused-vars
                    window.addEventListener("beforeunload", function (event) {
                        kernel.shutdown();
                        kernel.dispose();
                    });

                    widgetManager.models = await widgetManager._build_models();

                    // We add this function to Voila's Widget Manager
                    widgetManager.renderWidget = async function (modelId) {
                        const viewEl = document.body.querySelector(
                            `div[id="${modelId}"]`
                        );
                        const model = widgetManager.models[modelId];

                        viewEl.innerHTML = "";
                        // eslint-disable-next-line no-unused-vars
                        const view = await widgetManager.display_model(
                            undefined,
                            model,
                            { el: viewEl }
                        );
                        ``;
                    };

                    this.setState({
                        kernel: kernel,
                        widgetManager: widgetManager,
                    });
                });
            } else if (this.appMode == "nbconvert") {
                const widgetManager = new IllusionistWidgetManager();

                await widgetManager.loadState();
                this.setState({ widgetManager: widgetManager });
            }
        }
    }

    render() {
        const { kernel, widgetManager } = this.state;
        let {
            homepage,
            title,
            subtitle,
            external_link,
            kernel_name,
            vertical_layout,
            orientation,
            flex_show_source,
        } = this.state.dashboard.props || {};
        const { meta, pages } = this.state.dashboard;

        // Default is if missing vertical_layout=fill
        vertical_layout = vertical_layout ? vertical_layout : "fill";

        // Default orientation based on the layout
        if (!orientation) {
            orientation = vertical_layout == "scroll" ? "rows" : "columns";
        }

        return (
            <ThemeProvider theme={theme}>
                <div className="jupyter-flex">
                    <DashboardErrorBoundary>
                        <Provider
                            value={{
                                kernel: kernel,
                                widgetManager: widgetManager,
                                showCardSource: flex_show_source,
                            }}
                        >
                            <Dashboard
                                homepage={homepage}
                                title={title}
                                subtitle={subtitle}
                                externalLink={external_link}
                                kernelName={kernel_name}
                                verticalLayout={vertical_layout}
                                orientation={orientation}
                                meta={meta}
                                pages={pages}
                            />
                        </Provider>
                    </DashboardErrorBoundary>
                </div>
            </ThemeProvider>
        );
    }
}

export default JupyterFlex;
