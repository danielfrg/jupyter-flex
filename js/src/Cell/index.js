import React from "react";

import {
    RichMedia,
    Media,
    StreamText,
    KernelOutputError,
} from "@nteract/outputs";
// import { Outputs } from "@nteract/presentational-components";
import { Provider as MathJaxProvider } from "@nteract/mathjax";

import Widget from "./widget";

class DashboardCell extends React.Component {
    render() {
        let { cell_type, source, outputs } = this.props;

        if (Array.isArray(source)) {
            // Saved .ipynb files split the source into an array
            source = source.join("\n");
        }

        let childs;
        if (cell_type == "markdown") {
            childs = <Media.Markdown data={source} />;
        } else if (cell_type == "code") {
            if (!outputs) {
                return null;
            }
            childs = outputs.map((output, i) => {
                const { output_type } = output;

                if (output_type == "stream") {
                    if (Array.isArray(output.text)) {
                        // Saved .ipynb files split the text into an array
                        output.text = output.text.join("\n");
                    }
                    return <StreamText key={i} output={{ ...output }} />;
                } else if (output_type == "error") {
                    return <KernelOutputError key={i} output={{ ...output }} />;
                } else if (
                    output_type == "execute_result" ||
                    output_type == "display_data"
                ) {
                    // Saved .ipynb files split the outputs into an array
                    for (let key in output.data) {
                        if (Array.isArray(output.data[key])) {
                            output.data[key] = output.data[key].join("\n");
                        }
                    }

                    return (
                        <RichMedia key={i} data={{ ...output.data }}>
                            <Widget />
                            <Media.HTML />
                            <Media.SVG />
                            <Media.Image />
                            <Media.JavaScript />
                            <Media.Json />
                            <Media.LaTeX />
                            <Media.Markdown />
                            <Media.Plain />
                        </RichMedia>
                    );
                }
            });

            childs = <div className="codecell">{childs}</div>;
        } else {
            return null;
        }

        return (
            <MathJaxProvider src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML">
                {childs}
            </MathJaxProvider>
        );
    }
}

export default DashboardCell;
