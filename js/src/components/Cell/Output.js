import React from "react";

class CellOutput extends React.Component {
    render() {
        const { data, execution_count, metadata, output_type } = this.props;

        return (
            <div className="cell border-box-sizing code_cell rendered celltag_chart">
                <div className="jp-Cell-inputWrapper">
                    <div className="jp-InputArea jp-Cell-inputArea"></div>
                </div>

                <div className="output_wrapper">
                    <div className="output">
                        <div className="output_area">
                            <div className="jp-OutputPrompt jp-OutputArea-prompt"></div>

                            <div className="output_text output_subarea output_execute_result">
                                <pre>{data["text/plain"]}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CellOutput;
