import React from "react";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import { Box, Container, Grid } from "@material-ui/core";

import Section from "../Section";
import { getTagValue, slugify } from "../utils";

import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import AppBar from "@material-ui/core/AppBar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import { DashboardContext } from "../App/context";
import Navbar from "../Navbar";

const drawerWidth = 240;

const styles = (theme) => ({
    pageWrapper: {
        display: "flex",
        height: "100%",
    },
    page: {
        width: "100%",
        height: "calc(100% - 20px)",
        margin: 0,
        padding: 10,
        display: "flex",
        flexGrow: 1,
    },
    // sections: {
    //     width: "100%",
    //     height: "100%",
    //     margin: 0,
    //     padding: 0,
    //     flexGrow: 1,
    // },
    // root: {
    //     display: "flex",
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
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        // padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        const {
            sections,
            tags,
            dashboardOrientation,
            dashboardVerticalLayout,
        } = this.props;

        // Initial sidebar visibility defined if we have a sidebar section
        // let initSidebarVisibility = false;
        // sections.forEach((page) => {
        //     if (page.tags && page.tags.includes("sidebar")) {
        //         initSidebarVisibility = true;
        //     }
        // });

        // Orientation defaults to the dashboard one overwriten by tab
        let orientation = dashboardOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            orientation = orientationTag;
        }

        // Vertical layout defaults to the dashboard one overwriten by tab
        let verticalLayout = dashboardVerticalLayout;
        const layoutTag = getTagValue(tags, "layout");
        if (layoutTag) {
            verticalLayout = layoutTag;
        }

        this.state = {
            pageSlug: slugify(this.props.title),
            orientation: orientation,
            verticalLayout: verticalLayout,
            classNames: getTagValue(tags, "class", " "),
            loading: false,
            // sidebarVisible: initSidebarVisibility,
        };
    }

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    handleDrawerClose = () => {
        this.setState({ open: true });
    };

    render() {
        const { classes, sidebar, sections } = this.props;
        // const { sidebarVisible } = this.state;
        const { sidebarOpen } = this.context;

        // Flip orientation for flex
        let flexDirection =
            this.state.orientation == "columns" ? "row" : "column";

        // let sidebar;
        let sectionComponents = [];
        if (sections && sections.length > 0) {
            sections.forEach((section, i) => {
                if (section.tags && section.tags.includes("sidebar")) {
                    // sidebar = (
                    //     <Sidebar
                    //         // collapseCallback={this.collapseCallback}
                    //         {...section}
                    //     />
                    // );
                } else {
                    sectionComponents.push(
                        <Section
                            key={i}
                            pageOrientation={this.state.orientation}
                            {...section}
                        />
                    );
                }
            });
        }

        return (
            <div className={classes.pageWrapper}>
                {sidebar}
                <main
                    className={`${classes.page} ${clsx(classes.content, {
                        [classes.contentShift]: sidebarOpen,
                    })}`}
                >
                    {/* <div className={classes.drawerHeader} /> */}
                    <Grid
                        container
                        // spacing={3}
                        // className={`${classes.sections}`}
                        direction={flexDirection}
                    >
                        {sectionComponents}
                    </Grid>
                </main>
                {/* <Grid
                    container
                    spacing={3}
                    className={`${classes.section} ${clsx(classes.content, {
                        [classes.contentShift]: sidebarOpen,
                    })}`}
                    direction={flexDirection}
                >
                    {sectionComponents}
                </Grid> */}
            </div>
        );
    }
}
Page.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Page);
