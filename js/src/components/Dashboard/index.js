import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import {
    WidgetManager,
    connectKernel,
    RenderMimeRegistry,
    standardRendererFactories,
} from "../../voila";

import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import Cell from "../Cell";
import { slugify } from "../utils";

import "./style.scss";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        // Load dashboard json
        const dashboardTag = document.body.querySelector(
            `script[id="jupyter-flex-dashboard"]`
        );
        const json = JSON.parse(dashboardTag.innerHTML);

        // Default is verticalLayout=fill
        const verticalLayout = json["props"]["vertical_layout"]
            ? json["props"]["vertical_layout"]
            : "fill";

        // Default orientation based on the layout
        let orientation = verticalLayout == "scroll" ? "rows" : "columns";
        const orientationTag = json["props"]["orientation"];
        if (orientationTag) {
            orientation = orientationTag;
        }

        this.state = {
            dashboard: json,
            title: json["props"]["title"],
            author: json["props"]["author"],
            kernelName: json["props"]["kernel_name"],
            verticaLayout: verticalLayout,
            orientation: orientation,
            sourceCode: json["props"]["source_code"],
            meta: json["meta"],
            pages: json["pages"],
            kernel: null,
            widgetManager: null,
        };
    }

    async componentDidMount() {
        // TODO: Check if we should connect to kernel or not for nbconvert.
        // If nbconvert change widgetManager for HTML Manager

        // This is the same as voila/main.js
        // https://github.com/voila-dashboards/voila/blob/master/share/jupyter/voila/templates/base/static/main.js

        var kernel = await connectKernel();

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

        const rendermime = new RenderMimeRegistry({
            initialFactories: standardRendererFactories,
        });

        let widgetManager = new WidgetManager(context, rendermime, settings);

        // eslint-disable-next-line no-unused-vars
        window.addEventListener("beforeunload", function (e) {
            kernel.shutdown();
            kernel.dispose();
        });
        // We do this on Page.componentDidUpdate
        // await widgetManager.build_widgets();
        // renderMathJax();

        this.setState({ kernel: kernel, widgetManager: widgetManager });
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
                if (page.tags.includes("sidebar")) {
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
                                    ? "page-wrapper col-md-9 ml-sm-auto col-lg-10 p-0"
                                    : "page-wrapper"
                            }
                        >
                            {/* <Provider value={this.state}> */}
                            <Switch>{routeComponents}</Switch>
                            {/* </Provider> */}
                        </div>
                    </main>
                </div>
            </Router>
        );
    }
}

export default Dashboard;
