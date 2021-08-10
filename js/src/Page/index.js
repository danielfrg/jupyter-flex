import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import Section from "../Section";
import { getTagValue, slugify } from "../utils";

import { DashboardContext } from "../App/context";

const styles = (theme) => ({
    layoutFill: {
        height: "calc(100vh - 64px - 48px - 5px)", // header + paddin + extra room
        maxHeight: "calc(100vh - 64px - 48px - 5px)",
        display: "flex",
        flexDirection: "column",
    },
    layoutScroll: {
        display: "flex",
        flexDirection: "column",
    },
    page: {
        maxWidth: "100%",
        height: "100%",
        maxHeight: "100%",
        margin: 0,
        padding: 0,
    },
    // pageWrapper: {
    //     display: "flex",
    //     height: "100%",
    // },
    // page: {
    //     width: "100%",
    //     height: "calc(100% - 40px)",
    //     margin: 0,
    //     padding: 20,
    //     display: "flex",
    //     flexGrow: 1,
    // },
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        const {
            sections,
            tags,
            dashboardOrientation,
            dashboardVerticalLayout,
        } = this.props;

        // Orientation defaults to the dashboard and its overwriten by tag
        let orientation = dashboardOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            orientation = orientationTag;
        }

        // Vertical layout defaults to the dashboard one and its overwriten by tag
        let verticalLayout = dashboardVerticalLayout;
        const layoutTag = getTagValue(tags, "layout");
        if (layoutTag) {
            verticalLayout = layoutTag;
        }

        this.state = {
            pageSlug: slugify(this.props.title),
            orientation: orientation,
            verticalLayout: verticalLayout,
            classNames: getTagValue(tags, "class", " "),
            loading: false,
        };
    }

    componentDidMount() {
        // Iterate sections and see if one is tagged as sidebar
        const { sections } = this.props;
        let localSidebar = null;
        sections.forEach((section) => {
            if (section.tags && section.tags.includes("sidebar")) {
                localSidebar = section;
            }
        });
        // Add this sidebar to the context
        this.context.updateValue("sidebarLocal", localSidebar);
        this.context.updateValue("sidebarLocalExists", localSidebar !== null);
    }

    render() {
        const { classes, sections } = this.props;
        const { verticalLayout } = this.state;

        // Flip orientation for flex
        let flexDirection =
            this.state.orientation == "columns" ? "row" : "column";

        let sectionComponents = [];
        if (sections && sections.length > 0) {
            sections.forEach((section, i) => {
                if (!(section.tags && section.tags.includes("sidebar"))) {
                    sectionComponents.push(
                        <Section
                            key={i}
                            pageOrientation={this.state.orientation}
                            {...section}
                        />
                    );
                }
            });
        }

        const layoutClsName =
            verticalLayout == "scroll"
                ? classes.layoutScroll
                : classes.layoutFill;

        return (
            <div className={`page layout-${verticalLayout} ${layoutClsName}`}>
                <Grid
                    container
                    direction={flexDirection}
                    className={`${classes.page}`}
                >
                    {sectionComponents}
                </Grid>
            </div>
        );
    }
}
Page.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Page);
