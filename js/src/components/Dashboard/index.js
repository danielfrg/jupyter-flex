import React from "react";
import { Router } from "@reach/router";

import NavBar from "../NavBar";
import Page from "../Page";
import { slugify } from "../../utils";

import "./style.scss";

class Dashboard extends React.Component {
    state = {
        loading: true,
        title: "",
        author: "",
        kernelName: "",
        sourceCode: "",
        orientation: "",
        verticaLayout: "",
        pages: [],
    };

    componentDidMount() {
        const dashboardTag = document.body.querySelector(
            `script[id="jupyter-flex-dashboard"]`
        );
        const json = JSON.parse(dashboardTag.innerHTML);

        const verticalLayout = json["props"]["vertical_layout"]
            ? json["props"]["vertical_layout"]
            : "fill";

        // Default is verticalLayout=fill
        const orientation = verticalLayout == "scroll" ? "rows" : "columns";

        this.setState({
            loading: false,
            dashboard: json,
            title: json["props"]["title"],
            author: json["props"]["author"],
            kernelName: json["props"]["kernel_name"],
            verticaLayout: verticalLayout,
            orientation: orientation,
            sourceCode: json["props"]["source_code"],
            pages: json["pages"],
        });
    }

    render() {
        if (this.state.loading) {
            return <h1>loading … </h1>;
        }

        let pageComponents = [];
        if (this.state.pages.length > 0) {
            this.state.pages.forEach((page, i) => {
                const pageSlug = slugify(page.title);
                const pagePath = i == 0 ? "/" : `${pageSlug}`;
                pageComponents.push(
                    <Page
                        key={i}
                        path={pagePath}
                        title={page.title}
                        dashboardOrientation={this.state.orientation}
                        dashboardVerticaLayout={this.state.verticaLayout}
                        tags={page.tags}
                        sections={page.sections}
                    />
                );
            });
        }

        return (
            <div id="dashboard" className={this.state.verticaLayout}>
                <header>
                    <NavBar
                        title={this.state.title}
                        author={this.state.author}
                        sourceCode={this.state.sourceCode}
                        kernelName={this.state.kernelName}
                        pages={this.state.pages}
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
