import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import Cell from "../Cell";
import { slugify } from "../utils";
import { requirePromise } from "../loader";

import "./style.scss";

class Dashboard extends React.Component {
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
        // Default is verticalLayout=fill
        const verticalLayout = dashboardJSON["props"]["vertical_layout"]
            ? dashboardJSON["props"]["vertical_layout"]
            : "fill";

        // Default orientation based on the layout
        let orientation = verticalLayout == "scroll" ? "rows" : "columns";
        const orientationProp = dashboardJSON["props"]["orientation"];
        if (orientationProp) {
            orientation = orientationProp;
        }
        this.state = {
            title: dashboardJSON["props"]["title"],
            author: dashboardJSON["props"]["author"],
            kernelName: dashboardJSON["props"]["kernel_name"],
            verticaLayout: verticalLayout,
            orientation: orientation,
            sourceCode: dashboardJSON["props"]["source_code"],
            meta: dashboardJSON["meta"],
            pages: dashboardJSON["pages"],
            pageConfig: pageConfigJSON,
            dashboard: dashboardJSON,
        };
    }

    async componentDidMount() {
        const kernelId = this.state.pageConfig
            ? this.state.pageConfig.kernelId
            : null;

        if (kernelId !== undefined && kernelId != "") {
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
        this.state.meta.forEach((cell, i) => {
            metaCells.push(<Cell key={i} {...cell} />);
        });

        let sidebar;
        let routes = [];
        if (this.state.pages.length > 0) {
            this.state.pages.forEach((page) => {
                if (page.tags && page.tags.includes("sidebar")) {
                    sidebar = <Sidebar {...page.sections[0]} />;
                } else {
                    const pageSlug = slugify(page.title);
                    const pagePath = routes.length == 0 ? "/" : `/${pageSlug}`;
                    const el = (
                        <Page
                            dashboardOrientation={this.state.orientation}
                            dashboardVerticaLayout={this.state.verticaLayout}
                            widgetManager={this.state.widgetManager}
                            {...page}
                        />
                    );
                    routes.push({ path: pagePath, component: el });
                }
            });
        }

        const routeComponents = routes.map(({ path, component }, key) => (
            <Route exact path={path} key={key}>
                {component}
            </Route>
        ));

        return (
            <Router>
                <div id="dashboard" className={this.state.verticaLayout}>
                    <header>
                        <NavBar
                            title={this.state.title}
                            author={this.state.author}
                            sourceCode={this.state.sourceCode}
                            kernelName={this.state.kernelName}
                            pages={this.state.pages}
                        />
                    </header>

                    <main
                        role="main"
                        className="container-fluid content-wrapper"
                    >
                        <div style={{ display: "none" }}>{metaCells}</div>
                        {sidebar}
                        <div
                            className={
                                sidebar
                                    ? "col-md-9 ml-sm-auto col-lg-10 p-0"
                                    : ""
                            }
                        >
                            <Switch>{routeComponents}</Switch>
                        </div>
                    </main>
                </div>
            </Router>
        );
    }
}

export default Dashboard;
