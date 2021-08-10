import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import Section from "../Section";
import { getTagValue, slugify } from "../utils";

import { DashboardContext } from "../App/context";

const styles = (theme) => ({
    pageWrapper: {
        display: "flex",
        height: "100%",
    },
    page: {
        width: "100%",
        height: "calc(100% - 40px)",
        margin: 0,
        padding: 20,
        display: "flex",
        flexGrow: 1,
    },
    // sections: {
    //     width: "100%",
    //     height: "100%",
    //     margin: 0,
    //     padding: 0,
    //     flexGrow: 1,
    // },
});

class Page extends React.Component {
    constructor(props) {
        super(props);

        const {
            tags,
            dashboardOrientation,
            dashboardVerticalLayout,
        } = this.props;

        // Orientation defaults to the dashboard one overwriten by tab
        let orientation = dashboardOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            orientation = orientationTag;
        }

        // Vertical layout defaults to the dashboard one overwriten by tab
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
            // sidebarVisible: initSidebarVisibility,
        };
    }

    render() {
        const { classes, sections } = this.props;

        // Flip orientation for flex
        let flexDirection =
            this.state.orientation == "columns" ? "row" : "column";

        let sectionComponents = [];
        if (sections && sections.length > 0) {
            sections.forEach((section, i) => {
                if (section.tags && section.tags.includes("sidebar")) {
                    // sidebar = (
                    //     <Sidebar
                    //         // collapseCallback={this.collapseCallback}
                    //         {...section}
                    //     />
                    // );
                } else {
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

        return (
            <div className={classes.pageWrapper}>
                <Grid
                    container
                    // spacing={3}
                    // className={`${classes.sections}`}
                    direction={flexDirection}
                >
                    {sectionComponents}
                </Grid>
            </div>
        );
    }
}
Page.contextType = DashboardContext;

export default withStyles(styles, { withTheme: true })(Page);
