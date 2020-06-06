import React from "react";
import showdown from "showdown";

import CellOutput from "./Output";
import { createMarkup } from "../../utils";

import "./style.scss";

class Cell extends React.Component {
    constructor(props) {
        super(props);
        const { outputs } = this.props;

        this.mdconverter = new showdown.Converter({
            tables: true,
        });

        this.state = {
            outputs: outputs,
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
                    className="output_markdown rendered_html output_subarea markdown-body"
                    dangerouslySetInnerHTML={createMarkup(
                        this.mdconverter.makeHtml(this.props.source)
                    )}
                ></div>
            );
        } else {
            outputComponents = [];
            if (this.state.outputs) {
                this.state.outputs.forEach((output, i) => {
                    outputComponents.push(<CellOutput key={i} {...output} />);
                });
            }

            return (
                <div
                    className={`cell-wrapper cell-type-${this.props.cell_type}`}
                >
                    <div className="output_wrapper">
                        <div className="output">{outputComponents}</div>
                    </div>
                </div>
            );
        }

        return <pre>could not render cell</pre>;
    }
}

export default Cell;
