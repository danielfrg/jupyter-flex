import React from "react";
// import { NavLink } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Home from "@material-ui/icons/Home";
import Launch from "@material-ui/icons/Launch";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";

import { slugify } from "../utils";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        boxShadow: "none",
        // color: "#FFF",
    },
    toolbar: {
        // minHeight: 36,
    },
    grow: {
        flexGrow: 1,
    },
    subtitle: {
        color: "#9F9E9E",
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
});

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { globalSidebar: false, pageSidebar: false };
    }

    componentDidMount() {
        const { pages } = this.props;

        if (pages) {
            pages.forEach((page) => {
                if (page.tags && page.tags.includes("sidebar")) {
                    // Global sidebar
                    this.setState({ globalSidebar: true });
                }
            });
        }
    }

    onNavlinkClick = (event) => {
        // TODO: Collapse menu when changing pages
        // eslint-disable-next-line no-undef
        // $("#navPages").collapse("hide");

        // See if the new page has a sidebar
        this.setState({ pageSidebar: false });
        const pageID = event.target.getAttribute("data-page-id");
        this.props.pages[pageID].sections.forEach((section) => {
            if (section.tags && section.tags.includes("sidebar")) {
                // Global sidebar
                this.setState({ pageSidebar: true });
            }
        });
    };

    render() {
        const {
            classes,
            homepage,
            title,
            subtitle,
            externalLink,
            pages,
        } = this.props;
        const { globalSidebar, pageSidebar } = this.state;

        let homepageBtn = "";
        if (homepage) {
            homepageBtn = (
                <IconButton
                    color="inherit"
                    aria-label="Go to homepage"
                    aria-haspopup="true"
                >
                    <Home />
                </IconButton>
            );
        }

        let pageButtons = [];
        if (pages && pages.length > 1) {
            pages.forEach((page, i) => {
                if (page.title && !page.tags.includes("sidebar")) {
                    const pageSlug = slugify(page.title);
                    const pagePath =
                        pageButtons.length == 0 ? "/" : `${pageSlug}`;
                    const newPage = (
                        <Button
                            key={i}
                            component={RouterLink}
                            to={pagePath}
                            color="inherit"
                        >
                            {page.title}
                        </Button>
                    );
                    pageButtons.push(newPage);
                }
            });
        }

        let subtitleEl;
        if (subtitle) {
            subtitleEl = (
                <Typography className={classes.subtitle}>{subtitle}</Typography>
            );
        }

        let externalLinkEl;
        if (externalLink) {
            externalLinkEl = (
                <Button
                    component={RouterLink}
                    to={externalLink}
                    color="inherit"
                >
                    <Launch />
                </Button>
            );
        }

        return (
            <div>
                <AppBar position="static" className={classes.root}>
                    <Toolbar className={classes.toolbar}>
                        {homepageBtn}
                        <Typography
                            variant="h6"
                            component="h1"
                            className={classes.title}
                        >
                            {title}
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            {pageButtons}
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-label="show pages"
                                // aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                // onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            {subtitleEl}
                            {externalLinkEl}
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-label="show navigation"
                                // aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                // onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Navbar);
