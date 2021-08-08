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

import DashboardCell from "../Cell";
import { DashboardContext } from "../App/context";
import { getTagValue } from "../utils";
import Modal from "../Modal";

const styles = (theme) => ({
    card: {
        width: "100%",
        height: "100%",
        flexGrow: 1,
    },
    header: {
        width: "100%",
        padding: "0 8px 8px",
    },
    title: {
        padding: "5px 0",
        fontSize: "1.05em",
        fontWeight: 600,
    },
    content: {
        width: "100%",
        height: "100%",
    },
    grow: {
        flexGrow: 1,
    },
    inside: {
        width: "100%",
        height: "100%",
        border: "none",
    },
});

class Card extends React.Component {
    constructor(props) {
        super(props);
        const { tags } = this.props;

        const sizeTag = getTagValue(tags, "size");

        this.state = {
            size: sizeTag ? sizeTag : 500,
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
            insideTabs,
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
                        color="inherit"
                        aria-label="Show source code"
                        aria-haspopup="true"
                        //  onClick={this.toggleHelpModal}
                        style={{ padding: 5 }}
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
                if (cell.metadata.tags.includes("body")) {
                    bodyComponents.push(
                        <DashboardCell showInputs={false} key={i} {...cell} />
                    );
                }
            });
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

        const styles = {
            flexGrow: size,
            flexShrink: size,
            flexBasis: "0px",
        };

        return (
            <Grid
                item
                sm
                className={classes.card}
                style={{
                    ...styles,
                }}
            >
                <Grid container className={classes.content} direction="column">
                    <Grid item>{header}</Grid>
                    <Grid item className={classes.grow}>
                        <MaterialCard
                            className={classes.inside}
                            variant="outlined"
                        ></MaterialCard>
                    </Grid>
                </Grid>
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
