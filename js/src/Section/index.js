import React from "react";

import Card from "../Card";
import { getTagValue, slugify } from "../utils";

import "./style.scss";

class Section extends React.Component {
    constructor(props) {
        super(props);
        const { tags, pageOrientation } = props;

        // elOrientation means the element orientation of this section is ___
        let elOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            elOrientation = orientationTag;
        } else if (pageOrientation == "rows") {
            elOrientation = "columns";
        } else {
            // default: if (pageOrientation == "columns")
            elOrientation = "rows";
        }

        const sizeTag = getTagValue(tags, "size");

        this.state = {
            size: sizeTag ? sizeTag : 500,
            elOrientation: elOrientation,
            classNames: getTagValue(tags, "class", " "),
            useTabs: tags && tags.includes("tabs") ? true : false,
            tabsFill: tags && tags.includes("no-nav-fill") ? false : true,
            tabsFade: tags && tags.includes("no-nav-fill") ? false : true,
        };
    }

    render() {
        const { pageOrientation, title, cards } = this.props;

        // Flip for flex
        let flexDirection =
            this.state.elOrientation == "columns" ? "row" : "column";
        let sectionClassName = pageOrientation == "columns" ? "column" : "row";

        const sectionSlug = slugify(title);
        const sectionTabs = this.state.useTabs ? "section-tabs" : "";

        let tabsButtons;
        if (this.state.useTabs) {
            flexDirection = "column";
            let tabsItems = [];
            cards.forEach((card, i) => {
                const cardSlug = slugify(card.header);
                const tabName = `${cardSlug}-tab`;
                const active = i == 0 ? "active show" : "";
                const ariaSelected = i == 0 ? "true" : "false";

                tabsItems.push(
                    <li key={i} className="nav-item">
                        <a
                            className={`nav-link ${active}`}
                            id={tabName}
                            href={`#${cardSlug}`}
                            data-toggle="tab"
                            role="tab"
                            aria-controls={cardSlug}
                            aria-selected={ariaSelected}
                        >
                            {card.header}
                        </a>
                    </li>
                );
            });

            const tabsFill = this.state.tabsFill ? "nav-fill" : "";
            tabsButtons = (
                <ul
                    className={`nav nav-tabs nav-bordered ${tabsFill}`}
                    id={`${sectionSlug}-nav`}
                    role="tablist"
                >
                    {tabsItems}
                </ul>
            );
        }

        let cardComponents;
        if (cards.length > 0) {
            if (!this.state.useTabs) {
                cardComponents = [];

                cards.forEach((card, i) => {
                    const cardComponent = (
                        <Card
                            key={i}
                            sectionOrientation={this.state.elOrientation}
                            {...card}
                        />
                    );
                    cardComponents.push(cardComponent);
                });
            } else {
                let tabDivs = [];

                cards.forEach((card, i) => {
                    const cardSlug = slugify(card.header);
                    const tabName = `${cardSlug}-tab`;
                    const active = i == 0 ? "active show" : "";
                    const tabsFade = this.state.tabsFade ? "fade" : "";

                    const el = (
                        <div
                            key={cardSlug}
                            id={cardSlug}
                            className={`tab-pane ${tabsFade} ${active}`}
                            role="tabpanel"
                            aria-labelledby={tabName}
                        >
                            <Card
                                key={i}
                                sectionOrientation={this.state.elOrientation}
                                insideTabs={true}
                                {...card}
                            />
                        </div>
                    );
                    tabDivs.push(el);
                });

                cardComponents = (
                    <div className="tab-content" id={`${sectionSlug}-tabs`}>
                        {tabDivs}
                    </div>
                );
            }
        }

        return (
            <div
                className={`section section-${sectionClassName} ${sectionTabs} d-flex flex-${flexDirection} ${this.state.classNames}`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                {tabsButtons}
                {cardComponents}
            </div>
        );
    }
}

export default Section;
