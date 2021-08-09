import React from "react";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import { DashboardContext } from "../App/context";

const styles = (theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
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
            <>
                <Drawer open={open} onClose={this.closeDrawer}>
                    asdasdasd
                </Drawer>
            </>
        );
    }
}
Sidebar.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Sidebar);
