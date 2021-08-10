import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Home from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import Launch from "@material-ui/icons/Launch";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreIcon from "@material-ui/icons/MoreVert";

import { DashboardContext } from "../App/context";
import { slugify } from "../utils";

const useStyles = makeStyles((theme) =>
    createStyles({
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
    })
);

export default function Navbar(props) {
    const classes = useStyles();
    const { homepage, title, subtitle, externalLink, pages } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const {
        sidebarOpen,
        sidebarLocalExists,
        sidebarGlobalExists,
        onNavbarMenuIconClick,
    } = React.useContext(DashboardContext);

    let mobileMenuItems = [];

    let homepageBtn = "";
    if (homepage) {
        homepageBtn = (
            <Button
                component={Link}
                href={homepage}
                rel="noopener"
                target="_blank"
                color="inherit"
            >
                <Home />
            </Button>
        );
    }

    let pageButtons = [];
    if (pages && pages.length > 1) {
        pages.forEach((page, i) => {
            if (page.title && !page.tags.includes("sidebar")) {
                const pageSlug = slugify(
                    page.title && page.title != "" ? page.title : `Page ${i}`
                );
                const pagePath = pageButtons.length == 0 ? "/" : `${pageSlug}`;
                const newPage = (
                    <Button
                        key={pageSlug}
                        to={pagePath}
                        color="inherit"
                        component={RouterLink}
                    >
                        {page.title}
                    </Button>
                );
                pageButtons.push(newPage);

                mobileMenuItems.push(
                    <MenuItem
                        key={pageSlug}
                        to={pagePath}
                        component={RouterLink}
                    >
                        <p>{page.title}</p>
                    </MenuItem>
                );
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
                rel="noopener"
                target="_blank"
                color="inherit"
            >
                <Launch />
            </Button>
        );

        mobileMenuItems.push(
            <MenuItem
                key="external"
                component={Link}
                href={externalLink}
                rel="noopener"
                target="_blank"
                color="inherit"
            >
                <p>External Link</p>
                <Launch />
            </MenuItem>
        );
    }

    // Mobile menu
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const mobileMenu = (
        <Menu
            keepMounted
            id="navbar-mobile-menu"
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {mobileMenuItems}
        </Menu>
    );

    return (
        <AppBar position="static" className={classes.navbar}>
            <Toolbar className={classes.toolbar}>
                {sidebarLocalExists || sidebarGlobalExists ? (
                    <IconButton
                        color="inherit"
                        aria-haspopup="true"
                        aria-label="show drawer"
                        aria-controls="primary-sidebar"
                        onClick={onNavbarMenuIconClick}
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
                <div className={classes.space} />
                <div className={classes.sectionDesktop}>
                    {subtitleEl}
                    {externalLinkEl}
                </div>
                <div className={classes.sectionMobile}>
                    <IconButton
                        color="inherit"
                        aria-haspopup="true"
                        aria-label="show navigation"
                        aria-controls="primary-menu-mobile"
                        onClick={handleMobileMenuOpen}
                    >
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
            {mobileMenuItems ? mobileMenu : null}
        </AppBar>
    );
}
