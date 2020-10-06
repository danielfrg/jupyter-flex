import React from "react";

import IllusionistWidgetManager from "@danielfrg/illusionist";

import NBCell from "../NBCell";
import { requirePromise } from "../require-loader";
import Dashboard from "./dashboard";
import { Provider } from "./context";

class JupyterFlexDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.appMode = "";

        let { dashboard, pageConfig } = this.props;

        // Load dashboard JSON from page (if not passed as a prop)
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

        // Load page config from page (if not passed as a prop)
        if (!pageConfig) {
            const pageConfigScriptTag = document.body.querySelector(
                `script[id="jupyter-config-data"]`
            );
            if (pageConfigScriptTag) {
                pageConfig = JSON.parse(pageConfigScriptTag.innerHTML);
            }
        }

        // Get defaults
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
        if (this.appMode == "voila") {
            // Load Voila using RequireJS, adapted from:
            // https://github.com/voila-dashboards/voila/blob/master/share/jupyter/voila/templates/base/static/main.js

            requirePromise(["voila"]).then(async (voila) => {
                const kernel = await voila.connectKernel();

                const context = {
                    session: {
                        kernel,
                        kernelChanged: {
                            connect: () => {},
                        },
                        statusChanged: {
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
                };

                // voila.renderMathJax();

                this.setState({ kernel: kernel, widgetManager: widgetManager });
            });
        } else if (this.appMode == "nbconvert") {
            const widgetManager = new IllusionistWidgetManager();
            await widgetManager.loadState();
            this.setState({ widgetManager: widgetManager });
        }
    }

    render() {
        let {
            title,
            logo,
            author,
            kernel_name,
            source_link,
            include_source,
            vertical_layout,
            orientation,
        } = this.state.dashboard.props || {};
        const { meta, pages } = this.state.dashboard;

        let metaCells = [];
        if (meta) {
            meta.forEach((cell, i) => {
                metaCells.push(<NBCell key={i} {...cell} />);
            });
        }

        let logoURL = "";
        if (logo) {
            if (this.appMode == "voila") {
                logoURL = `${this.state.pageConfig.baseUrl}voila/files/${logo}`;
            } else if (this.appMode == "nbconvert") {
                logoURL = `${logo}`;
            }
        }

        // Default is if missing vertical_layout=fill
        vertical_layout = vertical_layout ? vertical_layout : "fill";

        // Default orientation based on the layout
        if (!orientation) {
            orientation = vertical_layout == "scroll" ? "rows" : "columns";
        }

        return (
            <Provider
                value={{
                    kernel: this.state.kernel,
                    widgetManager: this.state.widgetManager,
                    showCardCells: include_source,
                }}
            >
                <div style={{ display: "none" }}>{metaCells}</div>
                <Dashboard
                    title={title}
                    logo={logoURL}
                    author={author}
                    kernelName={kernel_name}
                    sourceCodeLink={source_link}
                    verticalLayout={vertical_layout}
                    orientation={orientation}
                    pages={pages}
                />
            </Provider>
        );
    }
}

export default JupyterFlexDashboard;
