import React from "react";
import { NavLink } from "react-router-dom";

import { slugify } from "../utils";

class NavBar extends React.Component {
    componentDidMount() {}

    render() {
        const { title, logo, author, sourceCodeLink, pages } = this.props;

        let logoEl = "";
        if (logo) {
            logoEl = <img alt="logo" className="logo" src={logo}></img>;
        }

        let togglerButton = (
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

        let pagesHtml = [];
        if (pages && pages.length > 1) {
            pages.forEach((page) => {
                if (page.title && !page.tags.includes("sidebar")) {
                    const pageSlug = slugify(page.title);
                    const pagePath =
                        pagesHtml.length == 0 ? "/" : `${pageSlug}`;
                    const newPage = (
                        <li key={page.title} className="nav-item">
                            <NavLink
                                to={pagePath}
                                exact={true}
                                className="nav-link"
                                activeClassName="active"
                            >
                                {page.title}
                            </NavLink>
                        </li>
                    );
                    pagesHtml.push(newPage);
                }
            });
        }

        let authorHtml;
        if (author) {
            authorHtml = <span className="navbar-text">{author}</span>;
        }

        let sourceHtml;
        if (sourceCodeLink) {
            sourceHtml = (
                <ul className="navbar-nav">
                    <li key="source-code" className="nav-item">
                        <a
                            className="nav-link"
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
                        <span className="navbar-brand">
                            {logoEl}
                            {title}
                        </span>
                        {pagesHtml.length > 1 || sourceCodeLink || author
                            ? togglerButton
                            : null}
                        <div className="collapse navbar-collapse" id="navPages">
                            <ul className="nav navbar-nav mr-auto">
                                {pagesHtml.length > 1 ? pagesHtml : null}
                            </ul>
                            {authorHtml}
                            {sourceHtml}
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
