import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import { slugify } from "../utils";

class Dashboard extends React.Component {
    render() {
        const {
            title,
            logo,
            author,
            kernelName,
            sourceCodeLink,
            verticalLayout,
            orientation,
            pages,
        } = this.props;

        let sidebar;
        let routes = [];

        if (pages && pages.length > 0) {
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
                <div className={`jupyter-flex`}>
                    <div className={`dashboard-${verticalLayout}`}>
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
                            className="content-wrapper container-fluid"
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
                </div>
            </Router>
        );
    }
}

export default Dashboard;
