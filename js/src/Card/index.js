import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import MaterialCard from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Code from "@material-ui/icons/Code";
import HelpOutline from "@material-ui/icons/HelpOutline";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Cells } from "@nteract/presentational-components";

import DashboardCell from "../Cell";
import { DashboardContext } from "../App/context";
import { getTagValue } from "../utils";

const styles = (theme) => ({
    card: {
        // width: "100%",
        // height: "100%",
    },
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
        height: "100%",
    },
    grow: {
        flexGrow: 1,
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
        // border: "none",
    },
    cardContent: {
        height: "100%",
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
    },
    cardFooter: {
        padding: "0 8px 8px",
    },
    empty: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
});

class Card extends React.Component {
    constructor(props) {
        super(props);
        const { tags } = this.props;

        const sizeTag = getTagValue(tags, "size");

        this.state = {
            size: sizeTag ? parseInt(sizeTag) : true,
            classNames: getTagValue(tags, "class", " "),
            showSourceDialog: false,
            showInfoDialog: false,
        };
    }

    openSourceModal = () => {
        this.setState({ showSourceDialog: true });
    };

    closeSourceModal = () => {
        this.setState({ showSourceDialog: false });
    };

    openInfoModal = () => this.setState({ showInfoDialog: true });
    closeInfoModal = () => this.setState({ showInfoDialog: false });

    render() {
        const {
            classes,
            title,
            body,
            info,
            footer,
            insideTabs,
            sectionOrientation,
        } = this.props;
        const { size, showSourceDialog, showInfoDialog } = this.state;
        const { showCardSource } = this.context;

        // Card contents

        let header;
        if (title || showCardSource || (info && info.length > 0)) {
            // let headerBtns = null;
            let headerBtns = [];
            // // Source button and modal
            if (showCardSource) {
                headerBtns.push(
                    <IconButton
                        key="source"
                        color="inherit"
                        aria-label="Show source code"
                        aria-haspopup="true"
                        onClick={this.openSourceModal}
                        style={{ padding: "5px 8px" }}
                    >
                        <Code fontSize="small" />
                    </IconButton>
                );
            }

            if (info && info.length > 0) {
                headerBtns.push(
                    <IconButton
                        key="info"
                        color="inherit"
                        aria-label="Show source code"
                        aria-haspopup="true"
                        onClick={this.openInfoModal}
                        style={{ padding: "5px 8px" }}
                    >
                        <HelpOutline fontSize="small" />
                    </IconButton>
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
        if (body.length > 0) {
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

        // Source Modal

        const sourceCells = body.map((cell, i) => {
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

        const sourceModal = (
            <Dialog
                open={showSourceDialog}
                onClose={this.closeSourceModal}
                scroll="paper"
                maxWidth="md"
                fullWidth={true}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle>
                    {title ? `Source: ${title}` : "Source"}
                </DialogTitle>
                <DialogContent dividers={true}>{sourceCells}</DialogContent>
                <DialogActions>
                    <Button onClick={this.closeSourceModal}>Close</Button>
                </DialogActions>
            </Dialog>
        );

        // Info Modal

        let infoCells = [];
        info.forEach((cell, i) => {
            infoCells.push(
                <DashboardCell key={i} showInputs={false} {...cell} />
            );
        });

        const infoModal = (
            <Dialog
                open={showInfoDialog}
                onClose={this.closeInfoModal}
                scroll="paper"
                maxWidth="md"
                fullWidth={true}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle>{title ? `Info: ${title}` : "Info"}</DialogTitle>
                <DialogContent dividers={true}>{infoCells}</DialogContent>
                <DialogActions>
                    <Button onClick={this.closeInfoModal}>Close</Button>
                </DialogActions>
            </Dialog>
        );

        let cardsClsName =
            sectionOrientation == "column"
                ? classes.cardInColumn
                : classes.cardInRow;
        cardsClsName = insideTabs ? classes.cardInTabs : classes.card;

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
                    className={classes.box}
                    variant="outlined"
                >
                    <Grid
                        item
                        container
                        component={CardContent}
                        className={classes.cardContent}
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
                {this.state.showInfoDialog ? infoModal : null}
                {this.state.showSourceDialog ? sourceModal : null}
            </Grid>
        );
    }
}
Card.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Card);
