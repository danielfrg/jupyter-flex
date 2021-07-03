import * as React from "react";

import { DashboardContext } from "../Dashboard/context";
import { uuidv4, onNextFrame } from "../utils";

class Widget extends React.Component {
    render() {
        const { widgetManager } = this.context;
        const { data } = this.props;
        const uuid = uuidv4();
        let model_id = data["model_id"];

        onNextFrame(() => {
            if (widgetManager) {
                widgetManager.renderWidget(model_id);
            }
        });

        return (
            <div id={uuid} className="output_subarea output_widget_state">
                <div id={model_id}>
                    <div className="container-fluid loading-full">
                        <div className="text-center">
                            <div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p>loading widget</p>
                        </div>
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
