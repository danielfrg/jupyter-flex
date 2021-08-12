import React from "react";
var _ = require("lodash");

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import MaterialCard from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Code from "@material-ui/icons/Code";
import HelpOutline from "@material-ui/icons/HelpOutline";

import { Cells } from "@nteract/presentational-components";

import DashboardCell from "../Cell";
import IconDialogBtn from "./IconDialogBtn";
import { DashboardContext } from "../App/context";
import { getTagValue } from "../utils";

const styles = (theme) => ({
    card: {},
    cardInColumn: {},
    cardInRow: {},
    cardInTabs: {
        maxWidth: "100%",
        height: "100%",
    },
    cardInSidebar: {
        maxWidth: "100%",
        height: "100%",
        padding: 8,
    },
    cardHeader: {
        padding: "6px 8px",
    },
    cardTitle: {
        padding: "5px 0",
        fontSize: "1.05em",
        fontWeight: 600,
    },
    space: {
        flexGrow: 1,
    },
    box: {},
    boxVLScroll: {
        flexBasis: "auto",
    },
    boxInSidebar: {
        flexGrow: 1,
        border: "none",
    },
    cardContent: {
        maxWidth: "100%",
        minHeight: "100%",
        height: "100%",
        overflow: "auto",
    },
    cardContentInSidebar: {
        height: "100%",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        padding: "0 8px",
    },
    cardFooter: {
        padding: "0 8px 8px",
    },
    empty: {
        margin: "auto",
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
});

export function getSourceCells(body) {
    if (!body) {
        return [];
    }
    return body.map((cell, i) => {
        if (cell.cell_type == "code") {
            return (
                <Cells key={i} className="source-cells">
                    <DashboardCell
                        key={i}
                        showInputs={true}
                        showOutputs={false}
                        {...cell}
                    />
                </Cells>
            );
        }
    });
}

export function getInfoCells(info) {
    if (!info) {
        return [];
    }
    return info.map((cell, i) => {
        return <DashboardCell key={i} showInputs={false} {...cell} />;
    });
}

class Card extends React.Component {
    render() {
        const {
            classes,
            title,
            body,
            info,
            footer,
            tags,
            inTabs,
            inSidebar,
            verticalLayout,
            sectionOrientation,
        } = this.props;
        const { showSource } = this.context;

        // Source dialog content

        const sourceCells = getSourceCells(body);
        const infoCells = getInfoCells(info);

        // Card contents

        const noHeaderTag = _.includes(tags, "no-header");

        let header;
        if (
            !inTabs &&
            !noHeaderTag &&
            (title ||
                (showSource && sourceCells.length > 0) ||
                (info && info.length > 0))
        ) {
            let headerBtns = [];

            if (showSource && sourceCells.length > 0) {
                const icon = <Code fontSize="small" />;
                headerBtns.push(
                    <IconDialogBtn
                        key="source"
                        icon={icon}
                        content={sourceCells}
                        title={title ? `Source: ${title}` : "Info"}
                    />
                );
            }

            if (info && info.length > 0) {
                const icon = <HelpOutline fontSize="small" />;
                headerBtns.push(
                    <IconDialogBtn
                        key="info"
                        icon={icon}
                        content={infoCells}
                        title={title ? `Info: ${title}` : "Info"}
                    />
                );
            }

            header = (
                <Grid container className={classes.cardHeader}>
                    <Grid item>
                        <Typography
                            component="h2"
                            variant="h6"
                            className={classes.cardTitle}
                        >
                            {title}
                        </Typography>
                    </Grid>
                    {headerBtns ? <div className={classes.space}></div> : null}
                    {headerBtns ? headerBtns : null}
                </Grid>
            );
        } // End - Header

        let bodyComponents = [];
        if (body && body.length > 0) {
            body.forEach((cell, i) => {
                if (cell.metadata.tags.includes("source")) {
                    return;
                }
                if (
                    cell.cell_type == "markdown" ||
                    (cell.cell_type == "code" && cell.outputs.length > 0)
                ) {
                    bodyComponents.push(
                        <DashboardCell key={i} showInputs={false} {...cell} />
                    );
                }
            });
        }

        if (bodyComponents.length == 0) {
            bodyComponents = (
                <Typography className={classes.empty}>empty card</Typography>
            );
        }

        // Card footer
        let footerComponents = [];
        if (footer && footer.length > 0) {
            footer.forEach((cell, i) => {
                footerComponents.push(
                    <DashboardCell key={i} showInputs={false} {...cell} />
                );
            });
        }

        // Variables

        let size = getTagValue(tags, "size");
        size = size ? parseInt(size) : true;

        let cardsClsName =
            sectionOrientation == "column"
                ? classes.cardInColumn
                : classes.cardInRow;
        cardsClsName = inTabs ? classes.cardInTabs : cardsClsName;
        cardsClsName = inSidebar ? classes.cardInSidebar : cardsClsName;

        let boxClsName = inSidebar ? classes.boxInSidebar : classes.box;
        let cardContentClsName = inSidebar
            ? classes.cardContentInSidebar
            : classes.cardContent;

        const customClsNames = getTagValue(tags, "class", " ");

        return (
            <Grid
                item
                container
                className={`card ${cardsClsName} ${customClsNames}`}
                direction="column"
                alignItems="stretch"
                xs={size}
            >
                {header ? <Grid item>{header}</Grid> : null}
                <Grid
                    item
                    component={MaterialCard}
                    className={`${boxClsName} ${
                        verticalLayout == "scroll" ? classes.boxVLScroll : ""
                    }`}
                    variant="outlined"
                    xs
                >
                    <Grid
                        item
                        container
                        direction="column"
                        component={CardContent}
                        className={cardContentClsName}
                        xs
                    >
                        {bodyComponents}
                    </Grid>
                </Grid>
                {footerComponents.length > 0 ? (
                    <Grid
                        item
                        container
                        component={CardActions}
                        className={classes.cardFooter}
                    >
                        {footerComponents}
                    </Grid>
                ) : null}
            </Grid>
        );
    }
}
Card.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Card);
