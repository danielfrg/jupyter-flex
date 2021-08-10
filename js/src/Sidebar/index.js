import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";

import { DashboardContext } from "../App/context";
import Card from "../Card";
import { insertItemInArray } from "../utils";

export const drawerWidth = 345;

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
    componentDidMount() {
        this.context.updateValue("onNavbarMenuIconClick", this.toggleDrawer);
    }

    toggleDrawer = () => {
        this.context.updateValue("sidebarOpen", !this.context.sidebarOpen);
    };

    handleDrawerClose = () => {
        this.context.updateValue("sidebarOpen", false);
    };

    render() {
        const { classes, globalContent } = this.props;
        const { sidebarOpen, sidebarLocal } = this.context;

        let content = sidebarLocal ? sidebarLocal : globalContent;
        if (!content) {
            return null;
        }

        content = content.cards.map((card, i) => {
            return <Card key={i} inSidebar={true} {...card} />;
        });
        function newDivider(i) {
            <Divider key={i} />;
        }
        content = insertItemInArray(content, newDivider);

        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={sidebarOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}></div>

                {content}
            </Drawer>
        );
    }
}
Sidebar.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Sidebar);
