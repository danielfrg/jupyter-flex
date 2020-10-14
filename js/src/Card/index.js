import React from "react";

import {
    Cells,
    Cell,
    Input,
    Prompt,
    Source,
} from "@nteract/presentational-components";

import DashboardCell from "../Cell";
import { DashboardContext } from "../App/context";
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

        let headerHtml;
        let sourceModal;
        let helpModal;

        // Create hdear
        if (title || showCardSource || (help && help.length > 0)) {
            let buttons = [];

            // Source button and modal
            if (showCardSource) {
                buttons.push(
                    <button
                        key="source"
                        className="modal-btn"
                        onClick={this.toggleSourceModal}
                    >
                        <i className="material-icons">code</i>
                    </button>
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
                buttons.push(
                    <button
                        key="help"
                        className="modal-btn"
                        onClick={this.toggleHelpModal}
                    >
                        <i className="material-icons">help_outline</i>
                    </button>
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

            headerHtml = (
                <div className="card-header d-flex justify-content-between align-items-baseline">
                    <h6>{!insideTabs ? title : null}</h6>
                    {buttons.length > 0 ? (
                        <div className="buttons">{buttons}</div>
                    ) : null}
                </div>
            );
        } // End header if

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

            footerComponents = (
                <div className="card-footer text-muted">{footerComponents}</div>
            );
        }

        return (
            <div
                className={`card card-${cardClassName} ${this.state.classNames}`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                {headerHtml}

                <div className="card-body d-flex flex-column">
                    {bodyComponents}
                </div>

                {footerComponents}
                {this.state.showSourceModal ? sourceModal : null}
                {this.state.showHelpModal ? helpModal : null}
            </div>
        );
    }
}
Card.contextType = DashboardContext;

export default Card;
