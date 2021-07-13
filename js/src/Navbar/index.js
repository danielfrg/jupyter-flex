import React from "react";
import { NavLink } from "react-router-dom";

import Button from "react-bootstrap/Button";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import ToggleButton from "react-bootstrap/ToggleButton";

import { slugify } from "../utils";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { globalSidebar: false, pageSidebar: false };
    }

    componentDidMount() {
        const { pages } = this.props;

        pages.forEach((page) => {
            if (page.tags && page.tags.includes("sidebar")) {
                // Global sidebar
                this.setState({ globalSidebar: true });
            }
        });
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
            home,
            logo,
            title,
            subtitle,
            sourceCodeLink,
            pages,
        } = this.props;
        const { globalSidebar, pageSidebar } = this.state;

        let homeBtn = "";
        if (home) {
            homeBtn = (
                <a href={home} className="home">
                    <i className="material-icons">home</i>
                </a>
            );
        }

        let logoEl = "";
        if (logo) {
            logoEl = <img alt="logo" className="logo" src={logo}></img>;
        }

        let collapseSidebarButton = null;
        // <BootstrapNavbar.Toggle
        //     data-target="#sidebar"
        //     aria-controls="flex-main-sidebar"
        // />
        // <Button
        //     className="BootstrapNavbar-toggler"
        //     type="button"
        //     data-toggle="collapse"
        //     data-target="#sidebar"
        //     aria-controls="sidebar"
        //     aria-expanded="true"
        //     aria-label="Toggle sidebar"
        // >
        //     <span className="BootstrapNavbar-toggler-icon"></span>
        // </Button>

        let pageButtons = [];
        if (pages && pages.length > 1) {
            pages.forEach((page, i) => {
                if (page.title && !page.tags.includes("sidebar")) {
                    const pageSlug = slugify(page.title);
                    const pagePath =
                        pageButtons.length == 0 ? "/" : `${pageSlug}`;
                    const newPage = (
                        <NavLink
                            key={page.title}
                            to={pagePath}
                            exact={true}
                            className="nav-link"
                            activeClassName="active"
                            onClick={this.onNavlinkClick}
                            data-page-id={i}
                        >
                            {page.title}
                        </NavLink>
                    );
                    pageButtons.push(newPage);
                }
            });
        }

        let subtitleEl;
        if (subtitle) {
            subtitleEl = (
                <span className="subtitle BootstrapNavbar-text">
                    {subtitle}
                </span>
            );
        }

        let sourceEl;
        if (sourceCodeLink) {
            sourceEl = (
                <a
                    className="nav-link source-code"
                    href={sourceCodeLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Source Code"
                >
                    Source Code
                    <i className="material-icons">launch</i>
                </a>
            );
        }

        return (
            <header>
                <BootstrapNavbar fixed="top" variant="dark" expand="md">
                    <Container fluid>
                        <div className="nav-content">
                            {globalSidebar || pageSidebar
                                ? collapseSidebarButton
                                : null}
                            {homeBtn}
                            <BootstrapNavbar.Brand>
                                {logoEl}
                                {title}
                            </BootstrapNavbar.Brand>

                            <BootstrapNavbar.Toggle aria-controls="flex-main-navbar" />
                        </div>
                        <BootstrapNavbar.Collapse id="flex-main-navbar">
                            <div className="page-links d-flex mr-auto">
                                {pageButtons.length > 1 ? pageButtons : null}
                            </div>
                            <div className="page-links d-flex">
                                {subtitleEl}
                                {sourceEl}
                            </div>
                        </BootstrapNavbar.Collapse>
                        {/* <span className="d-inline-block" data-toggle="tooltip">
                            <div id="kernel-activity">a</div>
                        </span> */}
                    </Container>
                </BootstrapNavbar>
            </header>
        );
    }
}

export default Navbar;
