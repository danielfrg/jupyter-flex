import React, { Fragment } from "react";

import Container from "react-bootstrap/Container";

import Section from "../Section";
import Sidebar from "../Sidebar";
import { getTagValue, slugify } from "../utils";

class Page extends React.Component {
    constructor(props) {
        super(props);

        const { tags, dashboardOrientation } = this.props;

        // elOrientation means the element orientation of this page is ___
        let elOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            elOrientation = orientationTag;
        } else {
            elOrientation = dashboardOrientation;
        }

        this.state = {
            pageSlug: slugify(this.props.title),
            elOrientation: elOrientation,
            classNames: getTagValue(tags, "class", " "),
            loading: false,
        };
    }

    render() {
        const { sections } = this.props;

        // Flip orientation for flex
        let flexDirection =
            this.state.elOrientation == "columns" ? "row" : "column";

        let sidebar;
        let sectionComponents = [];
        if (sections && sections.length > 0) {
            sections.forEach((section, i) => {
                if (section.tags && section.tags.includes("sidebar")) {
                    sidebar = <Sidebar {...section} />;
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
                <Container fluid className={`page ${this.state.classNames}`}>
                    {sidebar}
                    <div
                        className={
                            sidebar
                                ? `section-wrapper flex-${flexDirection} col-md-9 ml-sm-auto col-lg-10`
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
