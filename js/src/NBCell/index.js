import React from "react";

// import { Outputs } from "@nteract/presentational-components";
import {
    RichMedia,
    Media,
    StreamText,
    KernelOutputError,
} from "@nteract/outputs";
import { Provider } from "@nteract/mathjax";

import Widget from "./Widget";

import "./style.scss";

class NBCell extends React.Component {
    render() {
        const { cell_type, outputs } = this.props;

        let childs;
        if (cell_type == "markdown") {
            childs = <Media.Markdown data={this.props.source} />;
        } else if (cell_type == "code") {
            if (!outputs) {
                return null;
            }
            childs = outputs.map((output, i) => {
                const { output_type } = output;

                if (output_type == "stream") {
                    return <StreamText key={i} output={{ ...output }} />;
                } else if (output_type == "error") {
                    return <KernelOutputError key={i} output={{ ...output }} />;
                } else {
                    // if (output_type == "execute_result")
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
            <Provider src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML">
                {childs}
            </Provider>
        );
    }
}

export default NBCell;
