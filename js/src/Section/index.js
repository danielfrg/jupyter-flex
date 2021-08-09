import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Card from "../Card";
import TabPanel from "./tabpanel";
import { resizeInterval, getTagValue, slugify } from "../utils";

const styles = (theme) => ({
    section: {
        maxWidth: "100%",
        maxHeight: "100%",
        margin: 0,
        padding: 0,
    },
    sectionInColumn: {
        "&:not(:first-child)": {
            paddingLeft: 0,
        },
    },
    sectionInRow: {
        "&:not(:first-child)": {
            paddingTop: 0,
        },
    },
    tabs: {
        height: "100%",
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
            size: sizeTag ? parseInt(sizeTag) : true,
            elOrientation: elOrientation,
            classNames: getTagValue(tags, "class", " "),
            useTabs: tags && tags.includes("tabs") ? true : false,
            selectedTab: 0,
            tabsFill: tags && tags.includes("tabs-no-fill") ? false : true,
            tabsAnimation:
                tags && tags.includes("tabs-no-animation") ? false : null,
        };
    }

    handleTabChange = (event, newValue) => {
        // resizeInterval();
        this.setState({ selectedTab: newValue });
    };

    render() {
        const { classes, pageOrientation, cards } = this.props;
        let {
            size,
            elOrientation,
            // classNames,
            useTabs,
            selectedTab,
            // tabsFill,
            // tabsAnimation,
        } = this.state;

        // Flip for flex
        let flexDirection = elOrientation == "columns" ? "row" : "column";
        // flexDirection = useTabs ? "column" : flexDirection;

        // let sectionClassName = pageOrientation == "columns" ? "column" : "row";
        // const sectionTabs = useTabs ? "section-tabs" : "";

        let cardEls = [];
        let tabs = [];
        if (cards && cards.length > 0) {
            cards.forEach((card, i) => {
                let cardEl = (
                    <Card
                        key={i}
                        sectionOrientation={elOrientation}
                        insideTabs={useTabs}
                        {...card}
                    />
                );

                if (useTabs) {
                    cardEl = (
                        <TabPanel key={i} index={i} value={selectedTab}>
                            {cardEl}
                        </TabPanel>
                    );
                    tabs.push(
                        <Tab key={i} index={i} label={card.title} value={i} />
                    );
                }

                cardEls.push(cardEl);
            });

            if (useTabs) {
                // const transition = tabsAnimation.toString();
                cardEls = (
                    <Grid
                        container
                        direction="column"
                        alignItems="stretch"
                        className={classes.tabs}
                    >
                        <Grid
                            item
                            component={Tabs}
                            value={selectedTab}
                            onChange={this.handleTabChange}
                            aria-label="Section tabs"
                        >
                            {tabs}
                        </Grid>
                        <Grid item xs>
                            {cardEls}
                        </Grid>
                    </Grid>
                );
            }
        }

        const sectionDirClsName =
            pageOrientation == "columns"
                ? classes.sectionInColumn
                : classes.sectionInRow;

        const spacing = flexDirection == "row" ? 2 : 1;

        return (
            <Grid
                item
                container
                xs={size}
                spacing={spacing}
                alignItems="stretch"
                direction={flexDirection}
                className={`section ${classes.section} ${sectionDirClsName}`}
            >
                {cardEls}
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Section);
