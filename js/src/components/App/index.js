import React, { Fragment } from "react";

import Dashboard from "../Dashboard";
import Cell from "../Cell";
import { requirePromise } from "../loader";

class App extends React.Component {
    constructor(props) {
        super(props);

        // Load page config
        const pageConfigScriptTag = document.body.querySelector(
            `script[id="jupyter-config-data"]`
        );
        let pageConfigJSON;
        if (pageConfigScriptTag) {
            pageConfigJSON = JSON.parse(pageConfigScriptTag.innerHTML);
        }

        // Load dashboard json
        const dashboardScriptTag = document.body.querySelector(
            `script[id="jupyter-flex-dashboard"]`
        );
        let dashboardJSON;
        dashboardJSON = JSON.parse(dashboardScriptTag.innerHTML);

        this.state = {
            pageConfig: pageConfigJSON,
            dashboard: dashboardJSON,
        };
    }

    async componentDidMount() {
        const kernelId = this.state.pageConfig
            ? this.state.pageConfig.kernelId
            : null;

        if (kernelId && kernelId != "") {
            // This is the same as Voila's main.js
            // https://github.com/voila-dashboards/voila/blob/master/share/jupyter/voila/templates/base/static/main.js
            requirePromise(["static/voila"]).then(async (voila) => {
                var kernel = await voila.connectKernel();

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

                var widgetManager = new voila.WidgetManager(
                    context,
                    rendermime,
                    settings
                );

                async function init() {
                    // it seems if we attach this to early, it will not be called
                    window.addEventListener("beforeunload", function (e) {
                        kernel.shutdown();
                        kernel.dispose();
                    });
                    // We do this on Page.componentDidUpdate
                    // await widgetManager.build_widgets();
                    voila.renderMathJax();
                }

                if (document.readyState === "complete") {
                    init();
                } else {
                    window.addEventListener("load", init);
                }

                this.setState({
                    kernel: kernel,
                    widgetManager: widgetManager,
                    voila: voila,
                });
            });
        }
    }

    render() {
        let metaCells = [];
        this.state.dashboard.meta.forEach((cell, i) => {
            metaCells.push(<Cell key={i} {...cell} />);
        });

        const {
            title,
            author,
            kernel_name,
            source_code,
        } = this.state.dashboard.props;
        let { vertical_layout, orientation } = this.state.dashboard.props;

        // Default is if missing vertical_layout=fill
        vertical_layout = vertical_layout ? vertical_layout : "fill";

        // Default orientation based on the layout
        if (!orientation) {
            orientation = vertical_layout == "scroll" ? "rows" : "columns";
        }
        return (
            <Fragment>
                <div style={{ display: "none" }}>{metaCells}</div>
                <Dashboard
                    title={title}
                    author={author}
                    kernelName={kernel_name}
                    sourceCode={source_code}
                    verticalLayout={vertical_layout}
                    orientation={orientation}
                    pages={this.state.dashboard.pages}
                    widgetManager={this.state.widgetManager}
                />
            </Fragment>
        );
    }
}

export default App;
