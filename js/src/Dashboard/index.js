import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";

import { DashboardContext } from "../App/context";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Page from "../Page";
import DashboardCell from "../Cell";
import { slugify } from "../utils";

const styles = (theme) => ({
    dashboard: {
        maxWidth: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
    },
});

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { pages } = this.props;
        const { updateValue } = this.context;

        pages.forEach((page) => {
            if (page.tags && page.tags.includes("sidebar")) {
                updateValue("navbarShowMenuIcon", true);
            }
        });
    }

    render() {
        const {
            classes,
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
                            dashboardVerticalLayout={verticalLayout}
                            dashboardOrientation={orientation}
                            sidebar={sidebar}
                            {...page}
                        />
                    );
                    routes.push({ path: pagePath, component: el });
                }
            });
        }

        const routeEls = routes.map(({ path, component }, key) => (
            <Route exact path={path} key={key}>
                {component}
            </Route>
        ));

        return (
            <Router hashType="noslash">
                <Box height="100vh" display="flex" flexDirection="column">
                    <div className="meta-cells">{metaCells}</div>
                    <Navbar
                        homepage={homepage}
                        title={title}
                        subtitle={subtitle}
                        externalLink={externalLink}
                        kernelName={kernelName}
                        pages={pages}
                    />
                    <Container className={classes.dashboard}>
                        <Switch>{routeEls}</Switch>
                    </Container>
                </Box>
            </Router>
        );
    }
}
Dashboard.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Dashboard);
