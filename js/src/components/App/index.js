import React from "react";

import { requirePromise } from "../loader";
import Dashboard from "../Dashboard";
import NBCell from "../NBCell";
import { Provider } from "../DashboardContext";

import WidgetManager from "./WidgetManager";
import "./style.scss";

class App extends React.Component {
    appMode = "";

    constructor(props) {
        super(props);

        // Load page config
        const pageConfigScriptTag = document.body.querySelector(
            `script[id="jupyter-config-data"]`
        );
        let pageConfig;
        if (pageConfigScriptTag) {
            pageConfig = JSON.parse(pageConfigScriptTag.innerHTML);
        }

        // Load dashboard json
        const dashboardScriptTag = document.body.querySelector(
            `script[id="jupyter-flex-dashboard"]`
        );
        let dashboard;
        dashboard = JSON.parse(dashboardScriptTag.innerHTML);

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
            const widgetManager = new WidgetManager();
            await widgetManager.loadState();
            this.setState({ widgetManager: widgetManager });
        }
    }

    render() {
        let metaCells = [];
        this.state.dashboard.meta.forEach((cell, i) => {
            // TODO uncomment this!! when I am done
            metaCells.push(<NBCell key={i} {...cell} />);
        });

        const {
            title,
            author,
            kernel_name,
            source_link,
            include_source,
        } = this.state.dashboard.props;
        let { vertical_layout, orientation } = this.state.dashboard.props;

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
                    author={author}
                    kernelName={kernel_name}
                    sourceCodeLink={source_link}
                    verticalLayout={vertical_layout}
                    orientation={orientation}
                    pages={this.state.dashboard.pages}
                />
            </Provider>
        );
    }
}

export default App;
