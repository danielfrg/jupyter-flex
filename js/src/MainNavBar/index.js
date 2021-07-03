import React from "react";
import { NavLink } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/NavBar";
import Container from "react-bootstrap/Container";

import { slugify } from "../utils";

class MainNavBar extends React.Component {
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

        let collapseSidebarButton = (
            <Button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#sidebar"
                aria-controls="sidebar"
                aria-expanded="true"
                aria-label="Toggle sidebar"
            >
                <span className="navbar-toggler-icon"></span>
            </Button>
        );

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
                <span className="subtitle navbar-text">{subtitle}</span>
            );
        }

        let sourceEl;
        if (sourceCodeLink) {
            sourceEl = (
                <ul className="navbar-nav">
                    <li key="source-code" className="nav-item">
                        <a
                            className="source-code nav-link"
                            href={sourceCodeLink}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Source Code"
                        >
                            Source Code
                            <i className="material-icons">launch</i>
                        </a>
                    </li>
                </ul>
            );
        }

        return (
            <header>
                <Navbar variant="dark" expand="md">
                    <Container fluid>
                        <div className="nav-content">
                            {globalSidebar || pageSidebar
                                ? collapseSidebarButton
                                : null}
                            {homeBtn}
                            <Navbar.Brand>
                                {logoEl}
                                {title}
                            </Navbar.Brand>

                            <Navbar.Toggle aria-controls="main-navbar-nav" />
                        </div>
                        <Navbar.Collapse id="main-navbar-nav">
                            <div className="page-links d-flex mr-auto">
                                {pageButtons.length > 1 ? pageButtons : null}
                            </div>
                            {subtitleEl}
                            {sourceEl}
                            <span
                                className="d-inline-block"
                                data-toggle="tooltip"
                            >
                                <div id="kernel-activity"></div>
                            </span>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default MainNavBar;
