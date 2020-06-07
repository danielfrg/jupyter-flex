import React from "react";

import Card from "../Card";
import { getTagValue } from "../utils";

import "./style.scss";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        const { tags } = props;

        this.state = {
            classNames: getTagValue(tags, "class", " "),
        };
    }

    render() {
        const { cards } = this.props;

        let cardComponents = [];
        if (cards.length > 0) {
            cards.forEach((card, i) => {
                const cardComponent = <Card key={i} {...card} />;
                cardComponents.push(cardComponent);
            });
        }

        return (
            <div className="sidebar col-md-2">
                <div className="d-flex flex-column section">
                    {cardComponents}
                </div>
            </div>
        );
    }
}

export default Sidebar;
