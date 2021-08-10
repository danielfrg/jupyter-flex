import React from "react";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import { Box, Container, Grid } from "@material-ui/core";

import Section from "../Section";
import { getTagValue, slugify } from "../utils";

import { DashboardContext } from "../App/context";
import { drawerWidth } from "../Sidebar";

const styles = (theme) => ({
    pageWrapper: {
        display: "flex",
        height: "100%",
    },
    page: {
        width: "100%",
        height: "calc(100% - 40px)",
        margin: 0,
        padding: 20,
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
            tags,
            dashboardOrientation,
            dashboardVerticalLayout,
        } = this.props;

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

    // handleDrawerClose = () => {
    //     this.setState({ open: false });
    // };

    // handleDrawerClose = () => {
    //     this.setState({ open: true });
    // };

    render() {
        const { classes, sidebar, sections } = this.props;
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
