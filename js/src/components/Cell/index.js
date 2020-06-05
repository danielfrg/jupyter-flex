import React from "react";

import CellOutput from "./Output";

class Cell extends React.Component {
    state = {
        loading: true,
        debug: false,
        outputs: [],
    };

    componentDidMount() {
        const { outputs } = this.props;

        // Decode
        let decodedOutputs = [];
        outputs.forEach((output) => {
            let decodedData = {};
            for (let key in output["data"]) {
                const decodedValue = output["data"][key].replace(
                    "</scr\\ipt>",
                    "</script>"
                );
                decodedData[key] = decodedValue;
            }
            output["data"] = decodedData;
            decodedOutputs.push(output);
        });

        this.setState({
            outputs: decodedOutputs,
            loading: false,
        });
    }

    render() {
        if (this.state.loading) {
            return "... loading ...";
        }

        let outputComponents;
        if (this.state.debug) {
            outputComponents = this.props.source;
        } else {
            outputComponents = [];
            this.state.outputs.forEach((output, i) => {
                outputComponents.push(
                    <CellOutput
                        key={i}
                        data={output.data}
                        execution_count={output.execution_count}
                        metadata={output.metadata}
                        output_type={output.output_type}
                    />
                );
            });
        }

        return (
            <div className={`cell-wrapper cell-type-{ this.props.cell_type }`}>
                {outputComponents}
            </div>
        );
    }
}

export default Cell;
