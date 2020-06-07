import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Page from "../Page";
import Sidebar from "../Sidebar";
import { getTagValue, slugify } from "../utils";

import "./style.scss";
import Cell from "../Cell";

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
        };
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
