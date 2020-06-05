import React from "react";
import { Link } from "@reach/router";

import { slugify } from "../../utils";

import "./style.scss";

class NavBar extends React.Component {
    componentDidMount() {}

    render() {
        const { author, source_code, pages } = this.props;

        let togglerButton;
        if (pages.length > 1 || source_code || author) {
            togglerButton = (
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
        }

        let pagesHtml = [];
        if (pages.length > 1) {
            pages.forEach((page, i) => {
                if (page.title) {
                    const pageSlug = slugify(page.title);
                    const pagePath = i == 0 ? "/" : pageSlug;
                    const newPage = (
                        <li key={page.title} className="nav-item">
                            <Link to={pagePath} className="nav-link">
                                {page.title}
                            </Link>
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
        if (source_code) {
            sourceHtml = (
                <ul className="navbar-nav">
                    <li key="source-code" className="nav-item">
                        <a
                            className="nav-link"
                            href={source_code}
                            target="_blank"
                            rel="noopener"
                            aria-label="Source Code"
                        >
                            <i className="material-icons">code</i> Source Code
                        </a>
                    </li>
                </ul>
            );
        }

        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand">{this.props.title}</span>
                    {togglerButton}
                    <div className="collapse navbar-collapse" id="navPages">
                        <ul className="nav navbar-nav mr-auto">{pagesHtml}</ul>
                    </div>
                    {authorHtml}
                    {sourceHtml}

                    <span className="d-inline-block" data-toggle="tooltip">
                        <div id="kernel-activity"></div>
                    </span>
                </div>
            </nav>
        );
    }
}

export default NavBar;
