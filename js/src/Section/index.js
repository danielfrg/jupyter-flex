import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Code from "@material-ui/icons/Code";
import HelpOutline from "@material-ui/icons/HelpOutline";

import { DashboardContext } from "../App/context";
import Card, { getSourceCells, getInfoCells } from "../Card";
import IconDialogBtn from "../Card/IconDialogBtn";
import TabPanel from "./tabpanel";
import { resizeInterval, getTagValue } from "../utils";

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
            marginLeft: 20,
        },
    },
    sectionInRow: {
        "&:not(:first-child)": {
            paddingTop: 0,
            marginTop: 0, // This one is dont needed because of the card title
        },
    },
    grow: {
        flexGrow: 1,
    },
    tabs: {
        height: "100%",
    },
    tabHeaderIcon: {
        marginTop: 10,
    },
});

class Section extends React.Component {
    constructor(props) {
        super(props);
        const { tags, pageOrientation } = props;

        // orientation means the element orientation of this section is this
        let orientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            orientation = orientationTag;
        } else if (pageOrientation == "rows") {
            orientation = "columns";
        } else {
            // default: if (pageOrientation == "columns")
            orientation = "rows";
        }

        const sizeTag = getTagValue(tags, "size");

        this.state = {
            size: sizeTag ? parseInt(sizeTag) : true,
            orientation: orientation,
            classNames: getTagValue(tags, "class", " "),
            useTabs: tags && tags.includes("tabs") ? true : false,
            selectedTab: 0,
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
            orientation,
            // classNames,
            useTabs,
            selectedTab,
        } = this.state;
        const { showSource } = this.context;

        // Cards

        let contentEls = [];
        if (cards && cards.length > 0) {
            let tabs = [];

            cards.forEach((card, i) => {
                let cardEl = (
                    <Card
                        key={i}
                        sectionOrientation={orientation}
                        inTabs={useTabs}
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

                contentEls.push(cardEl);
            });

            if (useTabs) {
                const title = cards[selectedTab].title;
                const body = cards[selectedTab].body;
                const info = cards[selectedTab].info;
                const sourceCells = getSourceCells(body);
                const infoCells = getInfoCells(info);

                let headerBtns = [];
                if (showSource && sourceCells.length > 0) {
                    const icon = <Code fontSize="small" />;
                    headerBtns.push(
                        <IconDialogBtn
                            icon={icon}
                            content={sourceCells}
                            title={title ? `Source: ${title}` : "Info"}
                            className={classes.tabHeaderIcon}
                        />
                    );
                }

                if (info && info.length > 0) {
                    const icon = <HelpOutline fontSize="small" />;
                    headerBtns.push(
                        <IconDialogBtn
                            icon={icon}
                            content={infoCells}
                            title={title ? `Info: ${title}` : "Info"}
                            className={classes.tabHeaderIcon}
                        />
                    );
                }

                contentEls = (
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
                            {headerBtns ? (
                                <div className={classes.grow}></div>
                            ) : null}
                            {headerBtns ? headerBtns : null}
                        </Grid>
                        <Grid item xs>
                            {contentEls}
                        </Grid>
                    </Grid>
                );
            }
        }

        // Variables

        const sectionClsName =
            pageOrientation == "columns"
                ? classes.sectionInColumn
                : classes.sectionInRow;

        const flexDirection = orientation == "columns" ? "row" : "column";
        let spacing = flexDirection == "row" ? 2 : 1;
        spacing = useTabs ? 5 : spacing;

        return (
            <Grid
                item
                container
                xs={size}
                spacing={spacing}
                alignItems="stretch"
                direction={flexDirection}
                className={`section ${classes.section} ${sectionClsName}`}
            >
                {contentEls}
            </Grid>
        );
    }
}
Section.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Section);
