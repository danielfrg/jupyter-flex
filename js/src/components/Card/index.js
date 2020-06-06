import React, { Fragment } from "react";

import Cell from "../Cell";
import { getTagValue } from "../utils";

import Modal from "../Modal";

import "./style.scss";

class Card extends React.Component {
    constructor(props) {
        super(props);
        const { tags } = this.props;

        const sizeTag = getTagValue(tags, "size");

        this.state = {
            size: sizeTag ? sizeTag : 500,
            classNames: getTagValue(tags, "class", " "),
            showModal: false,
        };
    }

    render() {
        const { sectionOrientation, header, cells, help, footer } = this.props;

        let headerHtml;
        let modal;
        if (header || (help && help.length > 0)) {
            let headerTitle;
            if (!this.props.insideTabs) {
                headerTitle = <h6>{header}</h6>;
            }

            let buttons;
            if (help.length > 0) {
                buttons = (
                    <button className="modal-btn" onClick={this.toggleModal}>
                        <i className="material-icons">help_outline</i>
                    </button>
                );

                let helpCells = [];
                help.forEach((cell, i) => {
                    console.log(cell);
                    helpCells.push(<Cell key={i} {...cell} />);
                });

                modal = (
                    <Modal
                        title={`${header} help`}
                        onCloseClick={this.toggleModal}
                    >
                        {helpCells}
                    </Modal>
                );
            }

            headerHtml = (
                <div className="card-header d-flex justify-content-between align-items-baseline">
                    {headerTitle}
                    {buttons}
                </div>
            );
        }

        let contentComponents = [];
        if (cells.length > 0) {
            cells.forEach((cell, i) => {
                contentComponents.push(<Cell key={i} {...cell} />);
            });
        }

        let footerComponents = [];
        if (footer && footer.length > 0) {
            footer.forEach((cell, i) => {
                footerComponents.push(<Cell key={i} {...cell} />);
            });

            footerComponents = (
                <div className="card-footer text-muted">{footerComponents}</div>
            );
        }

        return (
            <div
                className={`card card-${sectionOrientation} ${this.state.classNames}" style="flex: ${this.state.size} ${this.state.size} 0px;`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                {headerHtml}

                <div className="card-body d-flex flex-column">
                    {contentComponents}
                </div>

                {footerComponents}
                {this.state.showModal ? modal : null}
            </div>
        );
    }

    toggleModal = () => this.setState({ showModal: !this.state.showModal });
}

export default Card;
