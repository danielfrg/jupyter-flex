import React from "react";

import NBCell from "../NBCell";
import { DashboardContext } from "../DashboardContext";
import { getTagValue } from "../utils";
import Modal from "../Modal";

import {
    Cells,
    Cell,
    Input,
    Prompt,
    Source,
} from "@nteract/presentational-components";

import "./style.scss";

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
        const { sectionOrientation, header, body, help, footer } = this.props;
        const { showCardCells } = this.context;

        let cardClassName = sectionOrientation == "columns" ? "column" : "row";

        let headerHtml;
        let sourceModal;
        let helpModal;
        if (header || showCardCells || (help && help.length > 0)) {
            let buttons = [];

            // Source Cells
            if (showCardCells) {
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
                                <Cell className="source-cell">
                                    <Input>
                                        <Prompt
                                            counter={cell.execution_count}
                                        />
                                        <Source language="python">
                                            {cell.source}
                                        </Source>
                                    </Input>
                                </Cell>
                            </Cells>
                        );
                    }
                });

                sourceModal = (
                    <Modal
                        title={`${header} - Source`}
                        onCloseClick={this.toggleSourceModal}
                    >
                        {sourceCells}
                    </Modal>
                );
            }

            // Help Cells
            if (help.length > 0) {
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
                    helpCells.push(<NBCell key={i} {...cell} />);
                });

                helpModal = (
                    <Modal
                        title={`${header} - Help`}
                        onCloseClick={this.toggleHelpModal}
                    >
                        {helpCells}
                    </Modal>
                );
            }

            headerHtml = (
                <div className="card-header d-flex justify-content-between align-items-baseline">
                    <h6>{!this.props.insideTabs ? header : null}</h6>
                    {buttons.length > 0 ? <div>{buttons}</div> : null}
                </div>
            );
        }

        let bodyComponents = [];
        if (body.length > 0) {
            body.forEach((cell, i) => {
                bodyComponents.push(<NBCell key={i} {...cell} />);
            });
        }

        let footerComponents = [];
        if (footer && footer.length > 0) {
            footer.forEach((cell, i) => {
                footerComponents.push(<NBCell key={i} {...cell} />);
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
