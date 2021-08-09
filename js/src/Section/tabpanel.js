import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    tabpanel: { height: "100%" },
    tabpanelContent: { height: "100%" },
});

function TabPanel(props) {
    const classes = useStyles();
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            className={classes.tabpanel}
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box className={classes.tabpanelContent}>{children}</Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default TabPanel;
