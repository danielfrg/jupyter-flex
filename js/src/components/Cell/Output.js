import React from "react";

import { createMarkup, uuidv4 } from "../utils";

var Convert = require("ansi-to-html");

class CellOutput extends React.Component {
    ansiConverter;
    state = { displayData: "" };

    constructor(props) {
        super(props);
        this.ansiConverter = new Convert();

        let type = "";
        if (this.props.data) {
            if ("image/svg+xml" in this.props.data) {
                type = "image/svg+xml";
            } else if ("image/png" in this.props.data) {
                type = "image/png";
            } else if ("text/html" in this.props.data) {
                type = "text/html";
            } else if ("text/markdown" in this.props.data) {
                type = "text/markdown";
            } else if ("image/jpeg" in this.props.data) {
                type = "image/jpeg";
            } else if ("text/latex" in this.props.data) {
                type = "text/latex";
            } else if ("application/javascript" in this.props.data) {
                type = "application/javascript";
            } else if (
                "application/vnd.jupyter.widget-state+json" in this.props.data
            ) {
                type = "application/vnd.jupyter.widget-state+json";
            } else if (
                "application/vnd.jupyter.widget-view+json" in this.props.data
            ) {
                type = "application/vnd.jupyter.widget-view+json";
            } else if ("text/plain" in this.props.data) {
                type = "text/plain";
            }
        }

        this.state = { displayData: type };
    }

    render() {
        const { data, output_type } = this.props;

        if (output_type == "stream") {
            return this.displayStream(this.props.text);
        }

        let el = "";
        switch (this.state.displayData) {
            case "image/svg+xml":
                el = this.displaySVG(data);
                break;
            case "image/png":
                el = this.displayPNG(data);
                break;
            case "text/html":
                el = this.displayHTML(data);
                break;
            case "text/markdown":
                break;
            case "image/jpeg":
                el = this.displayJPEG(data);
                break;
            case "text/plain":
                el = this.displayTextPlain(data);
                break;
            case "text/latex":
                break;
            case "application/javascript":
                break;
            case "application/vnd.jupyter.widget-state+json":
                break;
            case "application/vnd.jupyter.widget-view+json":
                el = this.displayWidgetView(data);
                break;
        }

        return el;
    }

    displayWidgetView(data) {
        const uuid = uuidv4();
        return (
            <div id={uuid} className="output_subarea output_widget_state">
                <script type="text/javascript">
                    {`var element = document.getElementById("${uuid}");`}
                </script>
                <script type="application/vnd.jupyter.widget-view+json">
                    {JSON.stringify(
                        data["application/vnd.jupyter.widget-view+json"]
                    )}
                </script>
            </div>
        );
    }

    displayStream(text) {
        return (
            <div className="output_subarea output_stream output_stdout output_text">
                <pre>{this.ansiConverter.toHtml(text)}</pre>
            </div>
        );
    }

    getMetadata(key, mimetype = "") {
        if (mimetype && mimetype in this.props.metadata) {
            return this.props.metadata[mimetype][key];
        }
        return this.props.metadata[key];
    }

    displayTextPlain(data) {
        return <pre>{data["text/plain"]}</pre>;
    }

    displayHTML(data) {
        // What can go wrong
        // https://stackoverflow.com/questions/35614809/react-script-tag-not-working-when-inserted-using-dangerouslysetinnerhtml

        const content = data["text/html"];
        let extractedScript = /<script[\s\S]*<\/script>/g.exec(content);
        if (extractedScript) {
            this.runScript(extractedScript[0]);
        }
        return (
            <div
                className="output_html rendered_html output_subarea"
                dangerouslySetInnerHTML={createMarkup(data["text/html"])}
            ></div>
        );
    }

    runScript(reportScript) {
        // This runs the contents in script tag on a window/global scope
        let scriptToRun = reportScript;
        if (scriptToRun !== undefined) {
            //remove <script> and </script> tags since eval expects only code without html tags
            let scriptLines = scriptToRun.split("\n");
            scriptLines.pop();
            scriptLines.shift();
            let cleanScript = scriptLines.join("\n");
            // console.log("running script ", cleanScript);
            window.eval(cleanScript);
        }
    }

    displaySVG(data) {
        return (
            <div
                className="jp-RenderedSVG jp-OutputArea-output"
                data-mime-type="image/svg+xml"
                dangerouslySetInnerHTML={createMarkup(data["image/svg+xml"])}
            ></div>
        );
    }

    displayPNG(data) {
        const { metadata } = this.props;

        let params;
        const width = this.getMetadata("width", "image/png");
        const height = this.getMetadata("height", "image/png");
        const class_ = this.getMetadata("unconfined", "image/png");
        if (width) {
            params["width"] = width;
        }
        if (height) {
            params["height"] = height;
        }
        if (class_) {
            params["className"] = class_;
        }

        const usesFilesnames = "filenames" in metadata ? true : false;

        let components;
        if (usesFilesnames) {
            components = (
                <img
                    src={metadata["filenames"]["image/png"]}
                    alt="Output"
                    {...params}
                ></img>
            );
        } else {
            components = (
                <img
                    src={`data:image/png;base64,${data["image/png"]}`}
                    alt="Output"
                    {...params}
                ></img>
            );
        }

        return (
            <div className="jp-RenderedImage jp-OutputArea-output">
                {components}
            </div>
        );
    }

    displayJPEG(data) {
        const { metadata } = this.props;

        let params;
        const width = this.getMetadata("width", "image/jpeg");
        const height = this.getMetadata("height", "image/jpeg");
        const class_ = this.getMetadata("unconfined", "image/jpeg");
        if (width) {
            params["width"] = width;
        }
        if (height) {
            params["height"] = height;
        }
        if (class_) {
            params["className"] = class_;
        }

        const usesFilesnames = "filenames" in metadata ? true : false;

        let components;
        if (usesFilesnames) {
            components = (
                <img
                    src={metadata["filenames"]["image/jpeg"]}
                    alt="Output"
                    {...params}
                ></img>
            );
        } else {
            components = (
                <img
                    src={`data:image/jpeg;base64,${data["image/jpeg"]}`}
                    alt="Output"
                    {...params}
                ></img>
            );
        }

        return (
            <div className="jp-RenderedImage jp-OutputArea-output">
                {components}
            </div>
        );
    }
}

export default CellOutput;
