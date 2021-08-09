import React from "react";

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
import Navbar from "../Navbar";

const drawerWidth = 240;

const styles = (theme) => ({
    page: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        // display: "flex",
        // flexGrow: 1,
    },
    sections: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        flexGrow: 1,
    },
    root: {
        display: "flex",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
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

    // collapseCallback = (event) => {
    //     this.setState({ sidebarVisible: event });
    // };

    render() {
        const { classes, sidebar, sections } = this.props;
        // const { sidebarVisible } = this.state;

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

        {
            /* <Box className={classes.page}> */
        }
        return (
            <div className={classes.root}>
                {sidebar}
                {/* <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            {["Inbox", "Starred", "Send email", "Drafts"].map(
                                (text, index) => (
                                    <ListItem button key={text}>
                                        <ListItemIcon>
                                            {index % 2 === 0 ? (
                                                <InboxIcon />
                                            ) : (
                                                <MailIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                )
                            )}
                        </List>
                        <Divider />
                        <List>
                            {["All mail", "Trash", "Spam"].map(
                                (text, index) => (
                                    <ListItem button key={text}>
                                        <ListItemIcon>
                                            {index % 2 === 0 ? (
                                                <InboxIcon />
                                            ) : (
                                                <MailIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </div>
                </Drawer> */}
                <Grid
                    container
                    spacing={3}
                    className={classes.sections}
                    direction={flexDirection}
                >
                    {sectionComponents}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Page);
