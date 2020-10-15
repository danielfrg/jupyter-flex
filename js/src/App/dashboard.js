import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import NavBar from "../NavBar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import DashboardCell from "../Cell";
import { slugify } from "../utils";

class Dashboard extends React.Component {
    render() {
        const {
            home,
            logo,
            title,
            subtitle,
            kernelName,
            sourceCodeLink,
            verticalLayout,
            orientation,
            meta,
            pages,
        } = this.props;

        let metaCells = [];
        if (meta && meta.length > 0) {
            meta.forEach((cell, i) => {
                metaCells.push(<DashboardCell key={i} {...cell} />);
            });
        }

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
            <Router hashType="noslash">
                <div className={`jupyter-flex`}>
                    <div className="meta-cells">{metaCells}</div>
                    <div className={`dashboard-${verticalLayout}`}>
                        <NavBar
                            home={home}
                            logo={logo}
                            title={title}
                            subtitle={subtitle}
                            sourceCodeLink={sourceCodeLink}
                            kernelName={kernelName}
                            pages={pages}
                            sidebar={sidebar !== undefined}
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
