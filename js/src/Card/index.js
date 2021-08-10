import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import MaterialCard from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Code from "@material-ui/icons/Code";
import HelpOutline from "@material-ui/icons/HelpOutline";

import { Cells } from "@nteract/presentational-components";

import { DashboardContext } from "../App/context";
import DashboardCell from "../Cell";
import IconDialogBtn from "./IconDialogBtn";
import { getTagValue } from "../utils";

const styles = (theme) => ({
    grow: {
        flexGrow: 1,
    },
    card: { maxWidth: "100%" },
    cardInColumn: {
        "&:not(:first-child)": {
            paddingTop: 0,
        },
    },
    cardInRow: {
        "&:not(:first-child)": {
            paddingLeft: 0,
        },
    },
    cardInTabs: {
        maxWidth: "100%",
        height: "100%",
    },
    cardInSidebar: {
        maxWidth: "100%",
        height: "100%",
    },
    cardWrapper: {},
    cardHeader: {
        padding: "8px 8px",
    },
    cardTitle: {
        padding: "5px 0",
        fontSize: "1.05em",
        fontWeight: 600,
    },
    box: {
        flexGrow: 1,
    },
    boxInSidebar: {
        flexGrow: 1,
        border: "none",
    },
    cardContent: {
        height: "100%",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
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
    constructor(props) {
        super(props);
        const { tags } = this.props;

        const sizeTag = getTagValue(tags, "size");

        this.state = {
            size: sizeTag ? parseInt(sizeTag) : true,
            classNames: getTagValue(tags, "class", " "),
        };
    }

    render() {
        const {
            classes,
            title,
            body,
            info,
            footer,
            inTabs,
            inSidebar,
            sectionOrientation,
        } = this.props;
        const { size } = this.state;
        const { showSource } = this.context;

        // Source dialog content

        const sourceCells = getSourceCells(body);
        const infoCells = getInfoCells(info);

        // Card contents

        let header;
        if (
            !inTabs &&
            (title ||
                (showSource && sourceCells.length > 0) ||
                (info && info.length > 0))
        ) {
            let headerBtns = [];

            if (showSource && sourceCells.length > 0) {
                const icon = <Code fontSize="small" />;
                headerBtns.push(
                    <IconDialogBtn
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
                    {headerBtns ? <div className={classes.grow}></div> : null}
                    {headerBtns ? headerBtns : null}
                </Grid>
            );
        } // End - Header

        let bodyComponents = [];
        if (body && body.length > 0) {
            body.forEach((cell, i) => {
                // Only show if they are tagged with body, ignore source tag
                if (
                    cell.metadata.tags.includes("body") &&
                    (cell.cell_type == "markdown" ||
                        (cell.cell_type == "code" && cell.outputs.length > 0))
                ) {
                    bodyComponents.push(
                        <DashboardCell showInputs={false} key={i} {...cell} />
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

        let cardsClsName =
            sectionOrientation == "column"
                ? classes.cardInColumn
                : classes.cardInRow;
        cardsClsName = inTabs ? classes.cardInTabs : classes.card;
        cardsClsName = inSidebar ? classes.cardInSidebar : cardsClsName;
        let boxClsName = inSidebar ? classes.boxInSidebar : classes.box;
        let cardContentClsName = inSidebar
            ? classes.cardContentInSidebar
            : classes.cardContent;

        return (
            <Grid
                item
                container
                className={`card ${cardsClsName} ${classes.cardWrapper}`}
                direction="column"
                alignItems="stretch"
                xs={size}
            >
                <Grid item>{header}</Grid>
                <Grid
                    item
                    component={MaterialCard}
                    className={boxClsName}
                    variant="outlined"
                >
                    <Grid
                        item
                        container
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
