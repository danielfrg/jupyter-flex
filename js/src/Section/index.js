import React from "react";

import Card from "../Card";
import { getTagValue, slugify } from "../utils";

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
        let {
            size,
            elOrientation,
            classNames,
            useTabs,
            tabsFill,
            tabsFade,
        } = this.state;

        // Flip for flex
        let flexDirection = elOrientation == "columns" ? "row" : "column";
        let sectionClassName = pageOrientation == "columns" ? "column" : "row";

        const sectionSlug = slugify(title);
        const sectionTabs = useTabs ? "section-tabs" : "";

        let tabsButtons;
        if (useTabs) {
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

            tabsFill = tabsFill ? "nav-fill" : "";
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
        if (cards && cards.length > 0) {
            if (!useTabs) {
                cardComponents = [];

                cards.forEach((card, i) => {
                    const cardComponent = (
                        <Card
                            key={i}
                            sectionOrientation={elOrientation}
                            {...card}
                        />
                    );
                    cardComponents.push(cardComponent);
                });
            } else {
                let tabDivs = [];

                cards.forEach((card, i) => {
                    const cardSlug = slugify(card.title);
                    const tabName = `${cardSlug}-tab`;
                    const active = i == 0 ? "active show" : "";
                    tabsFade = tabsFade ? "fade" : "";

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
                                sectionOrientation={elOrientation}
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
                className={`section section-${sectionClassName} ${sectionTabs} d-flex flex-${flexDirection} ${classNames}`}
                style={{ flex: `${size} ${size} 0px` }}
            >
                {tabsButtons}
                {cardComponents}
            </div>
        );
    }
}

export default Section;
