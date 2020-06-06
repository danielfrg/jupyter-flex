import React from "react";

import Cell from "../Cell";
import { getTagValue } from "../../utils";

import "./style.scss";

class Card extends React.Component {
    state = {
        size: 500,
        classNames: "",
        isText: false,
        isFooter: false,
        isHelp: false,
    };

    componentDidMount() {
        const { tags, sectionOrientation } = this.props;

        let orientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            orientation = orientationTag;
        } else if (sectionOrientation == "rows") {
            orientation = "columns";
        } else {
            // default: if (sectionOrientation == "columns")
            orientation = "rows";
        }

        const sizeTag = getTagValue(tags, "size");

        this.setState({
            size: sizeTag ? sizeTag : 500,
            classNames: getTagValue(tags, "class", " "),
            isText: tags.includes("text") ? true : false,
            isFooter: tags.includes("footer") ? true : false,
            isHelp: tags.includes("help") ? true : false,
        });
    }

    render() {
        const { sectionOrientation, header, cells, footer } = this.props;

        let headerHtml;
        if (header && !this.props.insideTabs) {
            headerHtml = (
                <div className="card-header d-flex justify-content-between align-items-baseline">
                    <h6>{header}</h6>
                </div>
            );
        }

        let contentComponents = [];
        if (cells.length > 0) {
            cells.forEach((cell, i) => {
                contentComponents.push(<Cell key={i} {...cell} />);
            });
        }

        let footerComponents = [];
        if (footer && footer.length > 0) {
            footer.forEach((cell, i) => {
                footerComponents.push(<Cell key={i} {...cell} />);
            });

            footerComponents = (
                <div className="card-footer text-muted">{footerComponents}</div>
            );
        }

        return (
            <div
                className={`card card-${sectionOrientation} ${this.state.classNames}" style="flex: ${this.state.size} ${this.state.size} 0px;`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                {headerHtml}

                <div className="card-body d-flex flex-column">
                    {contentComponents}
                </div>

                {footerComponents}
            </div>
        );
    }
}

export default Card;
