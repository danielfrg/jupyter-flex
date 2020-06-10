import React, { Fragment } from "react";

import { requirePromise } from "../loader";
import Dashboard from "../Dashboard";
import Cell from "../Cell";

import * as htmlWidgetManager from "./HtmlWidgetManager";
import "./style.scss";

class App extends React.Component {
    voila;
    kernel;
    widgetManager;
    nbconvert;

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
            // voila mode: Load Voila using RequireJS
            // https://github.com/voila-dashboards/voila/blob/master/share/jupyter/voila/templates/base/static/main.js

            requirePromise(["voila"]).then(async (voila) => {
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
                    // eslint-disable-next-line no-unused-vars
                    window.addEventListener("beforeunload", function (event) {
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

                this.voila = voila;
                this.kernel = kernel;
                this.widgetManager = widgetManager;

                this.refreshWidgets();
            });
        } else {
            // nbconvert mode
            this.nbconvert = true;
        }
    }

    refreshWidgets = () => {
        if (this.voila) {
            // voila mode
            this.widgetManager.build_widgets();
        } else if (this.nbconvert) {
            // nbconvert mode

            htmlWidgetManager.renderWidgets(
                () =>
                    new htmlWidgetManager.HTMLManager({
                        loader: htmlWidgetManager.embedRequireLoader,
                    })
            );
        }
    };

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
                    refreshWidgets={this.refreshWidgets}
                />
            </Fragment>
        );
    }
}

export default App;
