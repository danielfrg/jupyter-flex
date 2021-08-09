import React from "react";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import { DashboardContext } from "../App/context";

const drawerWidth = 240;

const styles = (theme) => ({
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
    // root: {
    //     display: "flex",
    // },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
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

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: true };
    }

    componentDidMount() {
        this.context.updateValue("onNavbarMenuIconClick", this.toggleDrawer);
    }

    toggleDrawer = () => {
        this.setState({ open: !this.state.open });
        this.context.updateValue("sidebarOpen", !this.state.open);
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
        this.context.updateValue("sidebarOpen", false);
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
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
                    {["All mail", "Trash", "Spam"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        );
    }
}
Sidebar.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Sidebar);
