import React from "react";

import Section from "../Section";
import { slugify, getTagValue } from "../../utils";

import "./style.scss";

class Page extends React.Component {
    state = {
        pageSlug: "",
        classNames: "",
    };

    componentDidMount() {
        const { tags } = this.props;
        this.setState({
            pageSlug: slugify(this.props.title),
            classNames: getTagValue(tags, "class", " "),
        });
    }

    render() {
        const { title, direction, tags, sections } = this.props;

        let sectionComponents = [];
        if (sections.length > 0) {
            sections.forEach((section, i) => {
                sectionComponents.push(
                    <Section
                        key={i}
                        title={section.title}
                        direction={section.direction}
                        tags={section.tags}
                        cards={section.cards}
                    />
                );
            });
        }

        return (
            <div
                className={`page container-fluid d-flex flex-${direction} ${this.state.classNames}`}
            >
                {sectionComponents}
            </div>
        );
    }
}

export default Page;
