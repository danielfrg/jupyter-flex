import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import { DashboardContext } from "../App/context";
import DashboardCell from "../Cell";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { drawerWidth } from "../Sidebar";
import Page from "../Page";
import { slugify } from "../utils";

const styles = (theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    metaCells: {
        display: "none",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
});

class Dashboard extends React.Component {
    componentDidMount() {
        const { pages } = this.props;

        pages.forEach((page) => {
            if (page.tags && page.tags.includes("sidebar")) {
                this.context.updateValue("sidebarGlobalExists", true);
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
        const {
            sidebarOpen,
            sidebarLocalExists,
            sidebarGlobalExists,
        } = this.context;

        let metaCells = [];
        if (meta && meta.length > 0) {
            meta.forEach((cell, i) => {
                metaCells.push(<DashboardCell key={i} {...cell} />);
            });
        }

        let globalSidebar;
        let routes = [];
        if (pages && pages.length > 0) {
            pages.forEach((page) => {
                if (page.tags && page.tags.includes("sidebar")) {
                    globalSidebar = { ...page.sections[0] };
                } else {
                    const pageSlug = slugify(page.title);
                    const pagePath = routes.length == 0 ? "/" : `/${pageSlug}`;
                    const el = (
                        <Page
                            dashboardVerticalLayout={verticalLayout}
                            dashboardOrientation={orientation}
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
                <div className={classes.metaCells}>{metaCells}</div>
                <Sidebar globalContent={globalSidebar} />
                <Box className={classes.root}>
                    <Navbar
                        homepage={homepage}
                        title={title}
                        subtitle={subtitle}
                        externalLink={externalLink}
                        kernelName={kernelName}
                        pages={pages}
                    />
                    <main
                        className={`dashboard ${clsx(classes.content, {
                            [classes.contentShift]:
                                sidebarOpen &&
                                (sidebarLocalExists || sidebarGlobalExists),
                        })}`}
                    >
                        <Switch>{routeEls}</Switch>
                    </main>
                </Box>
            </Router>
        );
    }
}
Dashboard.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Dashboard);
