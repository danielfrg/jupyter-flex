import React from "react";
import { NavLink } from "react-router-dom";

import { slugify } from "../utils";

class NavBar extends React.Component {
    componentDidMount() {}

    render() {
        const {
            home,
            logo,
            title,
            subtitle,
            sourceCodeLink,
            pages,
            sidebar,
        } = this.props;

        let homeEl = "";
        if (home) {
            homeEl = (
                <a href={home} className="home">
                    <i className="material-icons">home</i>
                </a>
            );
        }

        let logoEl = "";
        if (logo) {
            logoEl = <img alt="logo" className="logo" src={logo}></img>;
        }

        let collapseButtonSidebar = (
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#sidebar"
                aria-controls="sidebar"
                aria-expanded="true"
                aria-label="Toggle sidebar"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
        );

        let collapseButton = (
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navPages"
                aria-controls="navPages"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
        );

        let pagesEl = [];
        if (pages && pages.length > 1) {
            pages.forEach((page) => {
                if (page.title && !page.tags.includes("sidebar")) {
                    const pageSlug = slugify(page.title);
                    const pagePath = pagesEl.length == 0 ? "/" : `${pageSlug}`;
                    const newPage = (
                        <li key={page.title} className="nav-item">
                            <NavLink
                                to={pagePath}
                                exact={true}
                                className="nav-link"
                                activeClassName="active"
                                onClick={() => {
                                    // eslint-disable-next-line no-undef
                                    $("#navPages").collapse("hide");
                                }}
                            >
                                {page.title}
                            </NavLink>
                        </li>
                    );
                    pagesEl.push(newPage);
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
                <nav className="navbar navbar-expand-md">
                    <div className="container-fluid">
                        {sidebar ? collapseButtonSidebar : null}
                        {homeEl}
                        <span className="navbar-brand">
                            {logoEl}
                            {title}
                        </span>
                        {pagesEl.length > 1 || sourceCodeLink || subtitle
                            ? collapseButton
                            : null}
                        <div id="navPages" className="collapse navbar-collapse">
                            <ul className="nav-pages navbar-nav mr-auto">
                                {pagesEl.length > 1 ? pagesEl : null}
                            </ul>
                            {subtitleEl}
                            {sourceEl}
                            <span
                                className="d-inline-block"
                                data-toggle="tooltip"
                            >
                                <div id="kernel-activity"></div>
                            </span>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default NavBar;
