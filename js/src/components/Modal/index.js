import React from "react";
import ReactDOM from "react-dom";

import "./style.scss";

const modalRoot = document.getElementById("flex-modal");

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement("div");
    }

    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        let children = (
            <div
                id="modal"
                className="modal fade show"
                tabIndex="-1"
                role="dialog"
                style={{ display: "block", paddingRight: "15px" }}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                {this.props.title}
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={this.props.onCloseClick}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">{this.props.children}</div>
                    </div>
                </div>
            </div>
        );
        return ReactDOM.createPortal(children, this.el);
    }
}

export default Modal;
