import * as React from "react";

import { DashboardContext } from "../DashboardContext";
import { uuidv4, onNextFrame } from "../utils";

class Widget extends React.Component {
    render() {
        const { data } = this.props;
        const { widgetManager } = this.context;

        const uuid = uuidv4();

        let model_id;
        if (widgetManager) {
            model_id = data["model_id"];

            onNextFrame(() => {
                this.context.widgetManager.renderWidget(model_id);
            });
        }

        return (
            <div id={uuid} className="output_subarea output_widget_state">
                <div id={model_id}>
                    <div className="loading-widget">
                        <div className="spinner-grow" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="loading-text">loading widget</p>
                    </div>
                </div>
                <script type="application/vnd.jupyter.widget-view+json">
                    {JSON.stringify(data)}
                </script>
            </div>
        );
    }
}

Widget.defaultProps = {
    mediaType: "application/vnd.jupyter.widget-view+json",
};

Widget.contextType = DashboardContext;

export default Widget;
