import React, { Fragment } from "react";

import Section from "../Section";
import Sidebar from "../Sidebar";
import { getTagValue, slugify } from "../utils";

class Page extends React.Component {
    constructor(props) {
        super(props);

        const {
            sections,
            tags,
            dashboardOrientation,
            dashboardVerticalLayout,
        } = this.props;

        // Initial sidebar visibility defined if we have a sidebar section
        let initSidebarVisibility = false;
        sections.forEach((page) => {
            if (page.tags && page.tags.includes("sidebar")) {
                initSidebarVisibility = true;
            }
        });

        // elOrientation means the element orientation of this page is ___
        let elOrientation = dashboardOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            elOrientation = orientationTag;
        }

        //
        let verticalLayout = dashboardVerticalLayout;
        const layoutTag = getTagValue(tags, "layout");
        if (layoutTag) {
            verticalLayout = layoutTag;
        }

        this.state = {
            pageSlug: slugify(this.props.title),
            elOrientation: elOrientation,
            verticalLayout: verticalLayout,
            classNames: getTagValue(tags, "class", " "),
            loading: false,
            sidebarVisible: initSidebarVisibility,
        };
    }

    collapseCallback = (event) => {
        this.setState({ sidebarVisible: event });
    };

    render() {
        const { sections } = this.props;
        const { sidebarVisible } = this.state;

        // Flip orientation for flex
        let flexDirection =
            this.state.elOrientation == "columns" ? "row" : "column";

        let sidebar;
        let sectionComponents = [];
        if (sections && sections.length > 0) {
            sections.forEach((section, i) => {
                if (section.tags && section.tags.includes("sidebar")) {
                    sidebar = (
                        <Sidebar
                            collapseCallback={this.collapseCallback}
                            {...section}
                        />
                    );
                } else {
                    sectionComponents.push(
                        <Section
                            key={i}
                            pageOrientation={this.state.elOrientation}
                            {...section}
                        />
                    );
                }
            });
        }

        return (
            <Fragment>
                <Container
                    fluid
                    className={`page page-${this.state.verticalLayout} ${this.state.classNames}`}
                >
                    {sidebar}
                    <div
                        className={
                            sidebarVisible
                                ? `section-wrapper flex-${flexDirection} ml-sm-auto col-md-8 col-lg-10`
                                : `section-wrapper flex-${flexDirection}`
                        }
                    >
                        {sectionComponents}
                    </div>
                </Container>
            </Fragment>
        );
    }
}

export default Page;
