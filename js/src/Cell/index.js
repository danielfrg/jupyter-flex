import React from "react";

import {
    Cell,
    Input,
    Prompt,
    Source,
    Outputs,
} from "@nteract/presentational-components";
import {
    Output,
    RichMedia,
    Media,
    StreamText,
    KernelOutputError,
} from "@nteract/outputs";
import Markdown from "./markdown";
import { Provider as MathJaxProvider } from "@nteract/mathjax";

import Widget from "./widget";
import { getTagValue } from "../utils";

class DashboardCell extends React.Component {
    render() {
        let {
            cell_type,
            execution_count,
            metadata,
            source,
            outputs,
            showInputs,
            showOutputs,
        } = this.props;

        const classNames = getTagValue(metadata.tags, "class", " ");

        // Saved .ipynb files split the source and outputs into an arrays
        // We merged them into a string for nteract
        if (source && Array.isArray(source)) {
            source = source.join("");
        }
        if (outputs) {
            outputs.map((output) => {
                const { text, data } = output;
                if (text && Array.isArray(text)) {
                    output.text = output.text.join("");
                }
                if (data) {
                    for (const [key, value] of Object.entries(data)) {
                        if (Array.isArray(value)) {
                            data[key] = value.join("");
                        }
                    }
                }
            });
        }

        let contentEl;

        if (cell_type == "markdown") {
            contentEl = (
                <Cell className={`md-cell ${classNames}`}>
                    <Markdown className={classNames} data={source} />
                </Cell>
            );
        } else if (cell_type == "code") {
            let inputEls;

            if (showInputs) {
                inputEls = (
                    <Input>
                        <Prompt className="prompt" counter={execution_count} />
                        <Source language="python">{source}</Source>
                    </Input>
                );
            }

            let outputEls;
            if (showOutputs && outputs && outputs.length > 0) {
                outputEls = (
                    <Outputs>
                        {outputs.map((output, i) => {
                            const { output_type } = output;

                            if (output_type == "stream") {
                                return (
                                    <Output key={i} output={output}>
                                        <StreamText />
                                    </Output>
                                );
                            } else if (output_type == "error") {
                                return (
                                    <Output key={i} output={output}>
                                        <KernelOutputError />
                                    </Output>
                                );
                            } else {
                                return (
                                    <RichMedia
                                        key={i}
                                        data={{ ...output.data }}
                                    >
                                        <Widget />
                                        <Media.HTML />
                                        <Media.SVG />
                                        <Media.Image mediaType="image/png" />
                                        <Media.Image mediaType="image/jpeg" />
                                        <Media.Image mediaType="image/gif" />
                                        <Media.JavaScript />
                                        <Media.Json />
                                        <Media.LaTeX />
                                        <Markdown />
                                        <Media.Plain />
                                    </RichMedia>
                                );
                            }
                        })}
                    </Outputs>
                );
            }

            if (inputEls || outputEls) {
                contentEl = (
                    <Cell className={`code-cell ${classNames}`}>
                        {inputEls}
                        {outputEls}
                    </Cell>
                );
            } else {
                return null;
            }
        } else {
            return null;
        }

        return (
            <MathJaxProvider src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML">
                {contentEl}
            </MathJaxProvider>
        );
    }
}

DashboardCell.defaultProps = {
    showInputs: true,
    showOutputs: true,
};

export default DashboardCell;
