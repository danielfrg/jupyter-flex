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
        const { tags } = this.props;
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
        const { parentDirection, header, cells } = this.props;

        let headerHtml;
        if (header) {
            let helpHtml;
            if (isHelp) {
                <span
                    className="help-button"
                    data-toggle="popover"
                    data-trigger="focus"
                    data-content="TODO HELP CONTENT"
                >
                    <i className="material-icons">help_outline</i>
                </span>;
            }

            headerHtml = (
                <div className="card-header d-flex justify-content-between align-items-baseline">
                    <h6>{header}</h6>
                    {helpHtml}
                </div>
            );
        }

        let cellComponents = [];
        if (cells.length > 0) {
            cells.forEach((cell, i) => {
                cellComponents.push(
                    <Cell
                        key={i}
                        cell_type={cell.cell_type}
                        execution_count={cell.execution_count}
                        metadata={cell.metadata}
                        outputs={cell.outputs}
                        source={cell.source}
                    />
                );
            });
        }

        return (
            <div
                className={`card card-${parentDirection} ${this.state.classNames}" style="flex: ${this.state.size} ${this.state.size} 0px;`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                {headerHtml}

                <div className="card-body d-flex flex-column">
                    {cellComponents}
                </div>
            </div>
        );
    }
}

export default Card;
