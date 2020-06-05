import React from "react";
import { Router } from "@reach/router";

import NavBar from "../NavBar";
import Page from "../Page";
import { slugify } from "../../utils";

import "./style.scss";

class Dashboard extends React.Component {
    state = { loading: true, dashboard: {} };

    componentDidMount() {
        const dashboardTag = document.body.querySelector(
            `script[id="jupyter-flex-dashboard"]`
        );
        const json = JSON.parse(dashboardTag.innerHTML);
        this.setState({ dashboard: json, loading: false });
    }

    render() {
        if (this.state.loading) {
            return <h1>loading … </h1>;
        }
        const { pages } = this.state.dashboard;

        let pageComponents = [];
        if (pages.length > 0) {
            pages.forEach((page, i) => {
                const pageSlug = slugify(page.title);
                const pagePath = i == 0 ? "/" : pageSlug;
                pageComponents.push(
                    <Page
                        key={i}
                        title={page.title}
                        path={pagePath}
                        direction={page.direction}
                        tags={page.tags}
                        sections={page.sections}
                    />
                );
            });
        }

        return (
            <div id="dashboard" className="filled">
                <header>
                    <NavBar
                        title={this.state.dashboard.props.title}
                        author={this.state.dashboard.props.author}
                        source_code={this.state.dashboard.props.source_code}
                        kernel_name={this.state.dashboard.props.kernel_name}
                        pages={this.state.dashboard.pages}
                    />
                </header>
                <main role="main" className="container-fluid content-wrapper">
                    <Router style={{ height: "100%" }}>{pageComponents}</Router>
                </main>
            </div>
        );
    }
}

export default Dashboard;
