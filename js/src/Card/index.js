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
import { Cells } from "@nteract/presentational-components";
import Paper from "@material-ui/core/Paper";

import DashboardCell from "../Cell";
import { DashboardContext } from "../App/context";
import { getTagValue } from "../utils";
import { resizeInterval } from "../utils";
import Modal from "../Modal";

const styles = (theme) => ({
    card: {
        // width: "100%",
        // height: "100%",
    },
    grow: {
        flexGrow: 1,
    },
    card_wrapper: {},
    header: {
        padding: "8px 8px",
    },
    title: {
        padding: "5px 0",
        fontSize: "1.05em",
        fontWeight: 600,
    },
    box: {
        flexGrow: 1,
        // border: "none",
    },
    content: {
        height: "100%",
        // padding: 0,
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
    },
    footer: {
        padding: "0 8px 8px",
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
            showSourceModal: false,
            showHelpModal: false,
        };
    }

    toggleSourceModal = () => {
        this.setState({ showSourceModal: !this.state.showSourceModal });
    };

    toggleHelpModal = () =>
        this.setState({ showHelpModal: !this.state.showHelpModal });

    render() {
        const {
            classes,
            title,
            body,
            help,
            footer,
            // insideTabs,
            // sectionOrientation,
        } = this.props;
        const { size } = this.state;
        const { showCardSource } = this.context;

        // let cardClassName = sectionOrientation == "columns" ? "column" : "row";

        let header;
        // let sourceModal;
        // let helpModal;

        // Header
        if (title || showCardSource || (help && help.length > 0)) {
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
                        // onClick={this.toggleSourceModal}
                        style={{ padding: "5px 8px" }}
                    >
                        <Code fontSize="small" />
                    </IconButton>
                );
            }

            if (help && help.length > 0) {
                headerBtns.push(
                    <IconButton
                        key="help"
                        color="inherit"
                        aria-label="Show source code"
                        aria-haspopup="true"
                        //  onClick={this.toggleHelpModal}
                        style={{ padding: "5px 8px" }}
                    >
                        <HelpOutline fontSize="small" />
                    </IconButton>
                );
            }

            //     const sourceCells = body.map((cell, i) => {
            //         if (cell.cell_type == "code") {
            //             return (
            //                 <Cells key={i} className="source-cells">
            //                     <DashboardCell
            //                         key={i}
            //                         showInputs={true}
            //                         showOutputs={false}
            //                         {...cell}
            //                     />
            //                 </Cells>
            //             );
            //         }
            //     });

            header = (
                <Grid container className={classes.header}>
                    <Grid item>
                        <Typography
                            component="h2"
                            variant="h6"
                            className={classes.title}
                        >
                            {title}
                        </Typography>
                    </Grid>
                    {headerBtns ? <div className={classes.grow}></div> : null}
                    {headerBtns ? headerBtns : null}
                </Grid>
            );
        }

        //         sourceModal = (
        //             <Modal
        //                 title={title ? `${title} - Source` : "Source"}
        //                 onCloseClick={this.toggleSourceModal}
        //             >
        //                 {sourceCells}
        //             </Modal>
        //         );
        //     }

        //     // Help button and modal
        //     if (help && help.length > 0) {
        //         headerBtns.push(
        //             <Button key="help" onClick={this.toggleHelpModal}>
        //                 <i className="material-icons">help_outline</i>
        //             </Button>
        //         );

        //         let helpCells = [];
        //         help.forEach((cell, i) => {
        //             helpCells.push(
        //                 <DashboardCell key={i} showInputs={false} {...cell} />
        //             );
        //         });

        //         helpModal = (
        //             <Modal
        //                 title={title ? `${title} - Help` : "Help"}
        //                 onCloseClick={this.toggleHelpModal}
        //             >
        //                 {helpCells}
        //             </Modal>
        //         );
        //     }

        //     headerBtns = <ButtonGroup>{headerBtns}</ButtonGroup>;
        // } // End header

        // Card body
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
                <Typography className={classes.paper}>empty card</Typography>
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

        console.log(footerComponents);

        return (
            <Grid
                item
                container
                className={`card ${classes.card} ${classes.card_wrapper}`}
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
                        className={classes.content}
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
                        className={classes.footer}
                        xs
                    >
                        {footerComponents}
                    </Grid>
                ) : null}
                {/* {this.state.showHelpModal ? helpModal : null} */}
                {/* {this.state.showSourceModal ? sourceModal : null} */}
            </Grid>

            // <BootstrapCard
            //     className={`card-${cardClassName} ${this.state.classNames}`}
            //     style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            // >
            //     <BootstrapCard.Header className="d-flex justify-content-between align-items-baseline">
            //         <BootstrapCard.Title>
            //             {!insideTabs ? title : null}
            //         </BootstrapCard.Title>
            //         {headerBtns}
            //         {/* {headerBtns ? (
            //         ) : null} */}
            //     </BootstrapCard.Header>

            //     <BootstrapCard.Body className="d-flex flex-column">
            //         {bodyComponents}
            //     </BootstrapCard.Body>

            //     {footerComponents.length > 0 ? (
            //         <BootstrapCard.Footer>
            //             {footerComponents}
            //         </BootstrapCard.Footer>
            //     ) : null}
            //     {this.state.showSourceModal ? sourceModal : null}
            //     {this.state.showHelpModal ? helpModal : null}
            // </BootstrapCard>
        );
    }
}
Card.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Card);
