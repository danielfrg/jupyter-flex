import React from "react";

import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { DashboardContext } from "../App/context";
import { uuidv4, onNextFrame } from "../utils";

const styles = (theme) => ({
    loading: {
        margin: "auto",
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
});

class Widget extends React.Component {
    render() {
        const { classes, data } = this.props;
        const { widgetManager } = this.context;
        const uuid = uuidv4();
        let model_id = data["model_id"];

        onNextFrame(() => {
            if (widgetManager) {
                widgetManager.renderWidget(model_id);
            }
        });

        return (
            <div
                id={uuid}
                className="jupyter-widget output_subarea output_widget_state"
            >
                <div id={model_id}>
                    <div className="loading">
                        <CircularProgress size={14} color="secondary" />
                        <Typography>loading widget {"     "}</Typography>
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

// This is messing up the widget rendering so we do this styles on cell.scss
// export default withStyles(styles, { withTheme: true })(Widget);
export default Widget;
