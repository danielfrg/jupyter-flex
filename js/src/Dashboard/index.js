import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";

import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import { DashboardContext } from "../App/context";
import DashboardCell from "../Cell";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { drawerWidth } from "../Sidebar";
import Page from "../Page";
import { slugify } from "../utils";

const styles = (theme) => ({
    layoutFill: {
        height: "100vh",
    },
    dashboard: {
        maxWidth: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
    },
    root: {
        display: "flex",
    },
    // appBar: {
    //     transition: theme.transitions.create(["margin", "width"], {
    //         easing: theme.transitions.easing.sharp,
    //         duration: theme.transitions.duration.leavingScreen,
    //     }),
    // },
    // appBarShift: {
    //     width: `calc(100% - ${drawerWidth}px)`,
    //     marginLeft: drawerWidth,
    //     transition: theme.transitions.create(["margin", "width"], {
    //         easing: theme.transitions.easing.easeOut,
    //         duration: theme.transitions.duration.enteringScreen,
    //     }),
    // },
    // menuButton: {
    //     marginRight: theme.spacing(2),
    // },
    // hide: {
    //     display: "none",
    // },
    // drawer: {
    //     width: drawerWidth,
    //     flexShrink: 0,
    // },
    // drawerPaper: {
    //     width: drawerWidth,
    // },
    // drawerHeader: {
    //     display: "flex",
    //     alignItems: "center",
    //     padding: theme.spacing(0, 1),
    //     // necessary for content to be below app bar
    //     ...theme.mixins.toolbar,
    //     justifyContent: "flex-end",
    // },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
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
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { pages } = this.props;
        const { updateValue } = this.context;

        pages.forEach((page) => {
            if (page.tags && page.tags.includes("sidebar")) {
                updateValue("sidebarExists", true);
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
        const { sidebarOpen, sidebarExists } = this.context;

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
                            // sidebar={sidebar}
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
                {/* <div className={classes.layoutFill}> */}
                <div className="meta-cells">{metaCells}</div>
                {sidebar}
                {/* <div className={classes.root}> */}
                <Box height="100vh" display="flex" flexDirection="column">
                    <Navbar
                        homepage={homepage}
                        title={title}
                        subtitle={subtitle}
                        externalLink={externalLink}
                        kernelName={kernelName}
                        pages={pages}
                    />
                    <main
                        className={clsx(classes.content, {
                            [classes.contentShift]:
                                sidebarOpen && sidebarExists,
                        })}
                    >
                        <Container className={classes.dashboard}>
                            <Switch>{routeEls}</Switch>
                        </Container>
                    </main>
                    {/* </div> */}
                    {/*  </div> */}
                </Box>
            </Router>
        );
    }
}
Dashboard.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Dashboard);
