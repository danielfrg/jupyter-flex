import React from "react";

import Card from "../Card";
import { getTagValue, slugify } from "../../utils";

import "./style.scss";

class Section extends React.Component {
    state = {
        size: 500,
        classNames: "",
        useTabs: false,
    };

    componentDidMount() {
        const { tags } = this.props;

        this.setState({
            size: getTagValue(tags, "size"),
            classNames: getTagValue(tags, "class", " "),
            useTabs: tags.includes("tabs") ? true : false,
            tabsFill: tags.includes("no-nav-fill") ? false : true,
            tabsFade: tags.includes("no-nav-fill") ? false : true,
        });
    }

    render() {
        const { title, direction, tags, cards } = this.props;

        const sectionSlug = slugify(title);
        const sectionDirection = this.state.useTabs ? "column" : direction;
        const sectionTabs = this.state.useTabs ? "section-tabs" : "";

        let tabsButtons;
        if (this.state.useTabs) {
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

            tabsButtons = (
                <ul
                    className={`nav nav-tabs nav-bordered ${this.state.tabsFill}`}
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
                            parentDirection={direction}
                            tags={card.tags}
                            cells={card.cells}
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

                    const el = (
                        <div
                            key={cardSlug}
                            id={cardSlug}
                            className={`tab-pane ${this.state.tabsFade} ${active}`}
                            role="tabpanel"
                            aria-labelledby={tabName}
                        >
                            <Card
                                key={i}
                                parentDirection={direction}
                                tags={card.tags}
                                cells={card.cells}
                            />
                        </div>
                    );
                    tabDivs.push(el);
                });

                cardComponents = (
                    <div class="tab-content" id={`${sectionSlug}-tabs`}>
                        {tabDivs}
                    </div>
                );
            }
        }

        return (
            <div
                className={`section section-${sectionDirection} ${sectionTabs} d-flex flex-${sectionDirection} ${this.state.classNames}`}
                style={{ flex: `${this.state.size} ${this.state.size} 0px` }}
            >
                {tabsButtons}
                {cardComponents}
            </div>
        );
    }
}

export default Section;
