import React from "react";

import { Cells } from "@nteract/presentational-components";

import DashboardCell from "../Cell";
import { DashboardContext } from "../Dashboard/context";
import { getTagValue } from "../utils";
import Modal from "../Modal";

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
            sectionOrientation,
            title,
            body,
            help,
            footer,
            insideTabs,
        } = this.props;
        const { showCardSource } = this.context;

        let cardClassName = sectionOrientation == "columns" ? "column" : "row";

        let sourceModal;
        let helpModal;

        // Create header
        let header_buttons = null;
        if (title || showCardSource || (help && help.length > 0)) {
            header_buttons = [];
            // Source button and modal
            if (showCardSource) {
                header_buttons.push(
                    <Button key="source" onClick={this.toggleSourceModal}>
                        <i className="material-icons">code</i>
                    </Button>
                );

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

                sourceModal = (
                    <Modal
                        title={title ? `${title} - Source` : "Source"}
                        onCloseClick={this.toggleSourceModal}
                    >
                        {sourceCells}
                    </Modal>
                );
            }

            // Help button and modal
            if (help && help.length > 0) {
                header_buttons.push(
                    <Button key="help" onClick={this.toggleHelpModal}>
                        <i className="material-icons">help_outline</i>
                    </Button>
                );

                let helpCells = [];
                help.forEach((cell, i) => {
                    helpCells.push(
                        <DashboardCell key={i} showInputs={false} {...cell} />
                    );
                });

                helpModal = (
                    <Modal
                        title={title ? `${title} - Help` : "Help"}
                        onCloseClick={this.toggleHelpModal}
                    >
                        {helpCells}
                    </Modal>
                );
            }

            header_buttons = <ButtonGroup>{header_buttons}</ButtonGroup>;
        } // End header

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

        return (
            <BootstrapCard
                className={`card-${cardClassName} ${this.state.classNames}`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                <BootstrapCard.Header className="d-flex justify-content-between align-items-baseline">
                    <BootstrapCard.Title>
                        {!insideTabs ? title : null}
                    </BootstrapCard.Title>
                    {header_buttons}
                    {/* {header_buttons ? (
                    ) : null} */}
                </BootstrapCard.Header>

                <BootstrapCard.Body className="d-flex flex-column">
                    {bodyComponents}
                </BootstrapCard.Body>

                {footerComponents.length > 0 ? (
                    <BootstrapCard.Footer>
                        {footerComponents}
                    </BootstrapCard.Footer>
                ) : null}
                {this.state.showSourceModal ? sourceModal : null}
                {this.state.showHelpModal ? helpModal : null}
            </BootstrapCard>
        );
    }
}
Card.contextType = DashboardContext;

export default Card;
