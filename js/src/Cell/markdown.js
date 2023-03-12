import MarkdownComponent from "@nteract/markdown";
import React from "react";

/**
 * @nteract/outputs does not set escapeHtml, so we pass it through here
 */
class Markdown extends React.Component {
  render() {
    return <MarkdownComponent source={this.props.data} escapeHtml={this.props.escapeHtml} />;
  }
}


Markdown.defaultProps = {
  data: "",
  mediaType: "text/markdown",
  escapeHtml: false,
};

export default Markdown;