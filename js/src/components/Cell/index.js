import React from "react";
import showdown from "showdown";

import CellOutput from "./Output";
import { createMarkup } from "../../utils";

import "./style.scss";

class Cell extends React.Component {
    converter;
    state = {
        loading: true,
        debug: false,
        outputs: [],
    };

    componentDidMount() {
        const { outputs } = this.props;

        this.converter = new showdown.Converter({
            tables: true,
        });

        this.setState({
            outputs: outputs,
            loading: false,
        });
    }

    render() {
        if (this.state.loading) {
            return "... loading ...";
        }

        let markdown;
        let outputComponents;
        if (this.state.debug) {
            return <pre>{this.props.source}</pre>;
        }

        if (this.props.cell_type == "markdown") {
            return (
                <div
                    className="output_markdown rendered_html output_subarea markdown-body"
                    dangerouslySetInnerHTML={createMarkup(
                        this.converter.makeHtml(this.props.source)
                    )}
                ></div>
            );
        } else {
            outputComponents = [];
            this.state.outputs.forEach((output, i) => {
                outputComponents.push(
                    <CellOutput
                        key={i}
                        data={output.data}
                        metadata={output.metadata}
                        output_type={output.output_type}
                    />
                );
            });

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
