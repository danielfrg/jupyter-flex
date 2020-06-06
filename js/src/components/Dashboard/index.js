import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Page from "../Page";
import { slugify } from "../utils";

import "./style.scss";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        const dashboardTag = document.body.querySelector(
            `script[id="jupyter-flex-dashboard"]`
        );
        const json = JSON.parse(dashboardTag.innerHTML);

        const verticalLayout = json["props"]["vertical_layout"]
            ? json["props"]["vertical_layout"]
            : "fill";

        // Default is verticalLayout=fill
        const orientation = verticalLayout == "scroll" ? "rows" : "columns";

        this.state = {
            dashboard: json,
            title: json["props"]["title"],
            author: json["props"]["author"],
            kernelName: json["props"]["kernel_name"],
            verticaLayout: verticalLayout,
            orientation: orientation,
            sourceCode: json["props"]["source_code"],
            pages: json["pages"],
        };
    }

    render() {
        let routes = [];
        if (this.state.pages.length > 0) {
            this.state.pages.forEach((page, i) => {
                const pageSlug = slugify(page.title);
                const pagePath = i == 0 ? "/" : `/${pageSlug}`;
                const el = (
                    <Page
                        dashboardOrientation={this.state.orientation}
                        dashboardVerticaLayout={this.state.verticaLayout}
                        {...page}
                    />
                );
                routes.push({ path: pagePath, component: el });
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
                        <Switch>{routeComponents}</Switch>
                    </main>
                </div>
            </Router>
        );
    }
}

export default Dashboard;
