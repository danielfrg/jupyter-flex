import React from "react";
import showdown from "showdown";

import Output from "../Output";
import { createMarkup, getTagValue } from "../utils";

import "./style.scss";

class Cell extends React.Component {
    constructor(props) {
        super(props);
        const { metadata, outputs } = this.props;
        const { tags } = metadata;

        this.mdconverter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            tasklists: true,
            simplifiedAutoLink: true,
            parseImgDimension: true,
        });

        this.state = {
            outputs: outputs,
            classNames: getTagValue(tags, "class", " "),
            debug: false,
        };
    }

    render() {
        let outputComponents;
        if (this.state.debug) {
            return <pre>{this.props.source}</pre>;
        }

        if (this.props.cell_type == "markdown") {
            return (
                <div
                    className={`output_markdown rendered_html output_subarea markdown-body ${this.state.classNames}`}
                    dangerouslySetInnerHTML={createMarkup(
                        this.mdconverter.makeHtml(this.props.source)
                    )}
                ></div>
            );
        } else {
            outputComponents = [];
            if (this.state.outputs) {
                this.state.outputs.forEach((output, i) => {
                    outputComponents.push(<Output key={i} {...output} />);
                });
            }

            return (
                <div
                    className={`cell-wrapper cell-type-${this.props.cell_type} ${this.state.classNames}`}
                >
                    <div className="output_wrapper">
                        <div className="output">{outputComponents}</div>
                    </div>
                </div>
            );
        }
    }
}

export default Cell;
