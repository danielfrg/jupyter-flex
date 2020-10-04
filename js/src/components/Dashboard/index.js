import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import { slugify } from "../utils";

import "./style.scss";

class Dashboard extends React.Component {
    render() {
        const {
            verticalLayout,
            orientation,
            title,
            logo,
            author,
            sourceCodeLink,
            kernelName,
            pages,
        } = this.props;

        let sidebar;
        let routes = [];

        if (pages.length > 0) {
            pages.forEach((page) => {
                if (page.tags && page.tags.includes("sidebar")) {
                    sidebar = <Sidebar {...page.sections[0]} />;
                } else {
                    const pageSlug = slugify(page.title);
                    const pagePath = routes.length == 0 ? "/" : `/${pageSlug}`;
                    const el = (
                        <Page
                            dashboardOrientation={orientation}
                            dashboardverticalLayout={verticalLayout}
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
                <div id="dashboard" className={verticalLayout}>
                    <NavBar
                        title={title}
                        logo={logo}
                        author={author}
                        sourceCodeLink={sourceCodeLink}
                        kernelName={kernelName}
                        pages={pages}
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
