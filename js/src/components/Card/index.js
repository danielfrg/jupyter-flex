import React from "react";

import NBCell from "../NBCell";
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
        const { sectionOrientation, header, body, help, footer } = this.props;

        let cardClassName = sectionOrientation == "columns" ? "column" : "row";

        let headerHtml;
        let modal;
        if (header || (help && help.length > 0)) {
            let headerTitle;
            if (!this.props.insideTabs) {
                headerTitle = <h6>{header}</h6>;

                let buttons;
                if (help.length > 0) {
                    buttons = (
                        <button
                            className="modal-btn"
                            onClick={this.toggleModal}
                        >
                            <i className="material-icons">help_outline</i>
                        </button>
                    );

                    let helpCells = [];
                    help.forEach((cell, i) => {
                        helpCells.push(<NBCell key={i} {...cell} />);
                    });

                    modal = (
                        <Modal
                            title={`${header}`}
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
                {this.state.showModal ? modal : null}
            </div>
        );
    }

    toggleModal = () => this.setState({ showModal: !this.state.showModal });
}

export default Card;
