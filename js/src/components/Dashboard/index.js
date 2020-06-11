import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import { slugify } from "../utils";

import "./style.scss";

class Dashboard extends React.Component {
    state = {
        title: "",
        author: "",
        kernelName: "",
        verticalLayout: "",
        orientation: "",
        sourceCode: "",
    };

    render() {
        let sidebar;
        let routes = [];

        if (this.props.pages.length > 0) {
            this.props.pages.forEach((page) => {
                if (page.tags && page.tags.includes("sidebar")) {
                    sidebar = <Sidebar {...page.sections[0]} />;
                } else {
                    const pageSlug = slugify(page.title);
                    const pagePath = routes.length == 0 ? "/" : `/${pageSlug}`;
                    const el = (
                        <Page
                            dashboardOrientation={this.props.orientation}
                            dashboardverticalLayout={this.props.verticalLayout}
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
                <div id="dashboard" className={this.props.verticalLayout}>
                    <NavBar
                        title={this.props.title}
                        author={this.props.author}
                        sourceCodeLink={this.props.sourceCodeLink}
                        kernelName={this.props.kernelName}
                        pages={this.props.pages}
                    />

                    <main
                        role="main"
                        className="container-fluid content-wrapper"
                    >
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
