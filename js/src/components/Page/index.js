import React from "react";

import Section from "../Section";
import { slugify, getTagValue } from "../../utils";

import "./style.scss";

class Page extends React.Component {
    state = {
        pageSlug: "",
        orientation: "",
        classNames: "",
        loading: true,
    };

    componentDidMount() {
        const {
            tags,
            dashboardOrientation,
            dashboardVerticaLayout,
        } = this.props;

        let orientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            orientation = orientationTag;
        } else {
            orientation = dashboardOrientation;
        }

        this.setState({
            pageSlug: slugify(this.props.title),
            orientation: orientation,
            classNames: getTagValue(tags, "class", " "),
            loading: false,
        });
    }

    render() {
        if (this.state.loading) {
            return <p>... loading ...</p>;
        }

        const { sections } = this.props;

        // Flip for flex
        let flexDirection;
        if (this.state.orientation == "columns") {
            flexDirection = "row";
        } else if (this.state.orientation == "rows") {
            flexDirection = "column";
        }

        let sectionComponents = [];
        if (sections.length > 0) {
            sections.forEach((section, i) => {
                sectionComponents.push(
                    <Section
                        key={i}
                        title={section.title}
                        pageOrientation={this.state.orientation}
                        tags={section.tags}
                        cards={section.cards}
                    />
                );
            });
        }

        return (
            <div
                className={`page container-fluid d-flex flex-${flexDirection} ${this.state.classNames}`}
            >
                {sectionComponents}
            </div>
        );
    }
}

export default Page;
