import React from "react";
var Convert = require("ansi-to-html");

import { createMarkup, uuidv4, onNextFrame } from "../utils";
import "./style.scss";

export function runScript(script) {
    // This runs the contents in script tag on a window/global scope
    let reportScript = script.trim();
    if (
        reportScript.startsWith("<script") &&
        reportScript.endsWith("</script>")
    ) {
        //remove <script> and </script> tags since eval expects code without html tags
        let scriptLines = reportScript.split("\n");
        scriptLines.pop();
        scriptLines.shift();
        reportScript = scriptLines.join("\n");
    }
    if (reportScript) {
        // Ok this part really is the worst lol
        // This is a hack to make Altair code not look for previousElementSibling
        // because of how we execute the script `document.currentScript` is always null
        // The script from altair has a fallback to look for the right ID
        // So we are always triggering that fallback
        // I should make a PR to vega or something to make this more secure
        reportScript = reportScript.replace(
            "let outputDiv = document.currentScript.previousElementSibling;",
            "let outputDiv = {id: 0};"
        );

        // console.log("running script:", reportScript);
        window.eval(reportScript);
    }
}

class Output extends React.Component {
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

    componentDidMount() {
        if (this.state.displayData == "text/html") {
            // If there are any script tags in the HTML code then we need to execute those
            // We need to do it after the components have been writen to the DOM
            // Also we need to use the runScript() util to run the code directly into the DOM
            // Since react doesn't execute this tags.
            // https://stackoverflow.com/questions/35614809/react-script-tag-not-working-when-inserted-using-dangerouslysetinnerhtml

            const content = this.props.data["text/html"];
            let extractedScript = /<script[\s\S]*<\/script>/g.exec(content);
            if (extractedScript) {
                onNextFrame(() => {
                    runScript(extractedScript[0]);
                });
            }
        }
    }

    render() {
        const { data, output_type } = this.props;

        if (output_type == "error") {
            return this.displayError(this.props.traceback);
        }
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
                el = this.displayJavascript(data);
                break;
            case "application/vnd.jupyter.widget-state+json":
                el = this.displayWidgetState(data);
                break;
            case "application/vnd.jupyter.widget-view+json":
                el = this.displayWidgetView(data);
                break;
        }

        return el;
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
        return (
            <div
                className="output_html rendered_html output_subarea"
                dangerouslySetInnerHTML={createMarkup(data["text/html"])}
            ></div>
        );
    }

    displayJavascript(data) {
        runScript(data["application/javascript"]);
        return <script>{data["application/javascript"]}</script>;
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

    displayWidgetState(data) {
        const uuid = uuidv4();
        return (
            <div id={uuid} className="output_subarea output_widget_state">
                <script type="text/javascript">
                    {`var element = document.getElementById("${uuid}");`}
                </script>
                <script type="application/vnd.jupyter.widget-state+json">
                    {JSON.stringify(
                        data["application/vnd.jupyter.widget-state+json"]
                    )}
                </script>
            </div>
        );
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

    displayError(text) {
        return (
            <div
                className="output_html rendered_html output_subarea"
                dangerouslySetInnerHTML={createMarkup(
                    this.ansiConverter.toHtml(text)
                )}
            ></div>
        );
    }

    displayStream(text) {
        return (
            <div className="output_subarea output_stream output_stdout output_text">
                <pre>{this.ansiConverter.toHtml(text)}</pre>
            </div>
        );
    }
}

export default Output;
