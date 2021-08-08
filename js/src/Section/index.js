import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import Card from "../Card";
import { resizeInterval, getTagValue, slugify } from "../utils";

const styles = (theme) => ({
    section: {
        width: "100%",
        // height: "100%",
        // flexGrow: 1,
    },
    // section_column: {
    // height: "100%",
    // flexGrow: 1,
    // },
    cards_column: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        // flexGrow: 1,
    },
    // section_row: {
    // height: "100%",
    // flexGrow: 1,
    // },
    cards_row: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        // flexGrow: 1,
    },
});

class Section extends React.Component {
    constructor(props) {
        super(props);
        const { tags, pageOrientation } = props;

        // elOrientation means the element orientation of this section is this
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
        const { classes, pageOrientation, title, cards } = this.props;
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
                    <Card
                        key={i}
                        sectionOrientation={elOrientation}
                        insideTabs={useTabs}
                        {...card}
                    />
                );

                if (useTabs) {
                    // const cardSlug = slugify(card.title);
                    // cardComponent = (
                    // <Tab
                    //     key={cardSlug}
                    //     eventKey={cardSlug}
                    //     title={card.title}
                    // >
                    //     {cardComponent}
                    // </Tab>
                    // );
                }

                cardEls.push(cardComponent);
            });

            if (useTabs) {
                // const transition = tabsAnimation.toString();
                // cardEls = (
                // <Tabs fill={tabsFill} transition={tabsAnimation}>
                //     {cardEls}
                // </Tabs>
                // );
            }
        }

        const cardsClassName =
            flexDirection == "column"
                ? classes.cards_column
                : classes.cards_row;

        const styles = {
            flexGrow: size,
            flexShrink: size,
            flexBasis: "0px",
        };

        return (
            <Grid
                item
                sm
                className={classes.section}
                style={{
                    ...styles,
                }}
            >
                <Grid
                    container
                    className={cardsClassName}
                    spacing={3}
                    direction={flexDirection}
                    justifyContent="center"
                    alignItems="center"
                >
                    {cardEls}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Section);
