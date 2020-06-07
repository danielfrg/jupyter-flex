import React, { Fragment } from "react";
import { renderMathJax } from "../../voila";

import Section from "../Section";
import Sidebar from "../Sidebar";
import { getTagValue, slugify, onNextFrame } from "../utils";

import "./style.scss";

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

    componentDidMount() {
        if (this.props.widgetManager) {
            onNextFrame(() => {
                this.props.widgetManager.build_widgets();
                renderMathJax();
            });
        }
    }

    componentDidUpdate() {
        if (this.props.widgetManager) {
            onNextFrame(() => {
                this.props.widgetManager.build_widgets();
                renderMathJax();
            });
        }
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
                {sidebar}
                <div className={`page ${this.state.classNames}`}>
                    <div
                        className={
                            sidebar
                                ? `section-wrapper container-fluid d-flex flex-${flexDirection} col-md-9 ml-sm-auto col-lg-10 p-0`
                                : `section-wrapper container-fluid d-flex flex-${flexDirection}`
                        }
                    >
                        {sectionComponents}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Page;
