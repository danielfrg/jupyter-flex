import React from "react";

import Section from "../Section";
import Sidebar from "../Sidebar";
import { slugify, getTagValue } from "../utils";

import "./style.scss";

class Page extends React.Component {
    constructor(props) {
        super(props);

        const { tags, dashboardOrientation } = this.props;

        // This means the element orientation of this page is ___
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
        if (sections.length > 0) {
            sections.forEach((section, i) => {
                if (section.tags.includes("sidebar")) {
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
            <div
                className={`page container-fluid d-flex flex-${flexDirection} ${this.state.classNames}`}
            >
                {sidebar}
                <div
                    className={
                        sidebar ? "col-md-9 ml-sm-auto col-lg-10 p-0" : ""
                    }
                >
                    {sectionComponents}
                </div>
            </div>
        );
    }
}

export default Page;
