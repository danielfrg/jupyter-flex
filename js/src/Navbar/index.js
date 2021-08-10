import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Home from "@material-ui/icons/Home";
import Launch from "@material-ui/icons/Launch";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MoreIcon from "@material-ui/icons/MoreVert";

import { DashboardContext } from "../App/context";
import { slugify } from "../utils";

const styles = (theme) => ({
    navbar: {
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    toolbar: {},
    space: {
        flexGrow: 1,
    },
    title: {
        fontWeight: 400,
    },
    subtitle: {
        marginTop: 6,
        color: "#666",
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

    render() {
        const {
            classes,
            homepage,
            title,
            subtitle,
            externalLink,
            pages,
        } = this.props;
        const {
            sidebarOpen,
            sidebarExists,
            onNavbarMenuIconClick,
        } = this.context;

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
                    component={Link}
                    href={externalLink}
                    target="_blank"
                    rel="noopener"
                    color="inherit"
                >
                    <Launch />
                </Button>
            );
        }

        return (
            <AppBar position="static" className={classes.navbar}>
                <Toolbar className={classes.toolbar}>
                    {sidebarExists ? (
                        <IconButton
                            aria-label="show drawer"
                            // aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={onNavbarMenuIconClick}
                            color="inherit"
                        >
                            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                    ) : null}
                    {homepageBtn}
                    <Typography
                        variant="h6"
                        component="h1"
                        className={classes.title}
                    >
                        {title}
                    </Typography>
                    <div className={classes.space} />
                    <div className={classes.sectionDesktop}>{pageButtons}</div>
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
                    <div className={classes.space} />
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
        );
    }
}
Navbar.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Navbar);
