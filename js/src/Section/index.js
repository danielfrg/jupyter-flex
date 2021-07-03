import React from "react";
import { useLayoutEffect } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Card from "../Card";
import { resizeInterval, getTagValue, slugify } from "../utils";

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
            tabsFill: tags && tags.includes("tabs-no-fill") ? false : true,
            tabsAnimation:
                tags && tags.includes("tabs-no-animation") ? false : null,
        };
    }

    onTabClick = (event) => {
        resizeInterval();
    };

    render() {
        const { pageOrientation, title, cards } = this.props;
        let {
            size,
            elOrientation,
            classNames,
            useTabs,
            tabsFill,
            tabsAnimation,
        } = this.state;

        // Flip for flex
        let flexDirection = elOrientation == "columns" ? "row" : "column";
        let sectionClassName = pageOrientation == "columns" ? "column" : "row";

        const sectionTabs = useTabs ? "section-tabs" : "";
        flexDirection = useTabs ? "column" : flexDirection;

        let cardEls;
        if (cards && cards.length > 0) {
            cardEls = [];

            cards.forEach((card, i) => {
                let cardComponent = (
                    // <h1 key={i}>{i}</h1>
                    <Card
                        key={i}
                        sectionOrientation={elOrientation}
                        insideTabs={useTabs}
                        {...card}
                    />
                );

                if (useTabs) {
                    const cardSlug = slugify(card.title);
                    cardComponent = (
                        <Tab
                            key={cardSlug}
                            eventKey={cardSlug}
                            title={card.title}
                        >
                            {cardComponent}
                        </Tab>
                    );
                }

                cardEls.push(cardComponent);
            });

            if (useTabs) {
                // const transition = tabsAnimation.toString();
                cardEls = (
                    <Tabs fill={tabsFill} transition={tabsAnimation}>
                        {cardEls}
                    </Tabs>
                );
            }
        }

        return (
            <div
                className={`section section-${sectionClassName} flex-${flexDirection} ${sectionTabs} ${classNames}`}
                style={{ flex: `${size} ${size} auto` }}
            >
                {/* {tabsButtons}
                {cardEls} */}
                {cardEls}
            </div>
        );
    }
}

export default Section;
