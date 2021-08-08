import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "../Navbar";
// import Sidebar from "../Sidebar";
// import Page from "../Page";
import DashboardCell from "../Cell";
import { slugify } from "../utils";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        // const { pages } = this.props;

        // Initial sidebar visibility defined if we have a sidebar section
        // let initSidebarVisibility = false;
        // pages.forEach((page) => {
        //     if (page.tags && page.tags.includes("sidebar")) {
        //         initSidebarVisibility = true;
        //     }
        // });

        // this.state = { sidebarVisible: initSidebarVisibility };
    }

    collapseCallback = (event) => {
        this.setState({ sidebarVisible: event });
    };

    render() {
        const {
            homepage,
            title,
            subtitle,
            externalLink,
            kernelName,
            verticalLayout,
            orientation,
            meta,
            pages,
        } = this.props;

        // const { sidebarVisible } = this.state;

        let metaCells = [];
        if (meta && meta.length > 0) {
            meta.forEach((cell, i) => {
                metaCells.push(<DashboardCell key={i} {...cell} />);
            });
        }

        // let sidebar;
        // let routes = [];
        // if (pages && pages.length > 0) {
        //     pages.forEach((page) => {
        //         if (page.tags && page.tags.includes("sidebar")) {
        //             sidebar = (
        //                 <Sidebar
        //                     collapseCallback={this.collapseCallback}
        //                     {...page.sections[0]}
        //                 />
        //             );
        //         } else {
        //             const pageSlug = slugify(page.title);
        //             const pagePath = routes.length == 0 ? "/" : `/${pageSlug}`;
        //             const el = (
        //                 <Page
        //                     dashboardOrientation={orientation}
        //                     dashboardVerticalLayout={verticalLayout}
        //                     {...page}
        //                 />
        //             );
        //             routes.push({ path: pagePath, component: el });
        //         }
        //     });
        // }

        // const routeComponents = routes.map(({ path, component }, key) => (
        //     <Route exact path={path} key={key}>
        //         {component}
        //     </Route>
        // ));

        return (
            <Router hashType="noslash">
                <div className="meta-cells">{metaCells}</div>
                <Navbar
                    homepage={homepage}
                    title={title}
                    subtitle={subtitle}
                    externalLink={externalLink}
                    kernelName={kernelName}
                    pages={pages}
                />
                {/* <Container fluid className="content-wrapper">
                        {sidebar}
                        <div
                            className={
                                sidebarVisible
                                    ? "ml-sm-auto col-md-8 col-lg-10 p-0"
                                    : ""
                            }
                        >
                            <Switch>{routeComponents}</Switch>
                        </div>
                    </Container> */}
            </Router>
        );
    }
}

export default Dashboard;
