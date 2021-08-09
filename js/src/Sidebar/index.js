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
});

class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { open: false };
    }

    componentDidMount() {
        // const context = React.useContext(DashboardContext);
        // const [state, setState] = React.useState({
        //     top: false,
        //     left: false,
        //     bottom: false,
        //     right: false,
        // });
        this.context.updateValue("onNavbarMenuIconClick", this.toggleDrawer);
    }

    toggleDrawer = (value) => {
        // if (
        //     event.type === "keydown" &&
        //     (event.key === "Tab" || event.key === "Shift")
        // ) {
        //     return;
        // }
        console.log("!!!!!!!!");
        this.setState({ open: !this.state.open });
    };

    closeDrawer = (value) => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        // const list = (anchor) => (
        //     <div
        //         className={clsx(classes.list, {
        //             [classes.fullList]: anchor === "top" || anchor === "bottom",
        //         })}
        //         role="presentation"
        //         // onClick={this.toggleDrawer(anchor, false)}
        //         // onKeyDown={this.toggleDrawer(anchor, false)}
        //     >
        //         <List>
        //             {["Inbox", "Starred", "Send email", "Drafts"].map(
        //                 (text, index) => (
        //                     <ListItem button key={text}>
        //                         <ListItemIcon>
        //                             {index % 2 === 0 ? (
        //                                 <InboxIcon />
        //                             ) : (
        //                                 <MailIcon />
        //                             )}
        //                         </ListItemIcon>
        //                         <ListItemText primary={text} />
        //                     </ListItem>
        //                 )
        //             )}
        //         </List>
        //         <Divider />
        //         <List>
        //             {["All mail", "Trash", "Spam"].map((text, index) => (
        //                 <ListItem button key={text}>
        //                     <ListItemIcon>
        //                         {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        //                     </ListItemIcon>
        //                     <ListItemText primary={text} />
        //                 </ListItem>
        //             ))}
        //         </List>
        //     </div>
        // );
        return (
            <Drawer
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
                        {["All mail", "Trash", "Spam"].map((text, index) => (
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
                        ))}
                    </List>
                </div>
            </Drawer>
        );
    }
}
Sidebar.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Sidebar);
