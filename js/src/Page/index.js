import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Box, Container, Grid } from "@material-ui/core";

import Section from "../Section";
import Sidebar from "../Sidebar";
import { getTagValue, slugify } from "../utils";

const styles = (theme) => ({
    page: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        flexGrow: 1,
    },
    sections: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
    },
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

        // Initial sidebar visibility defined if we have a sidebar section
        let initSidebarVisibility = false;
        sections.forEach((page) => {
            if (page.tags && page.tags.includes("sidebar")) {
                initSidebarVisibility = true;
            }
        });

        // elOrientation means the element orientation of this page is ___
        let elOrientation = dashboardOrientation;
        const orientationTag = getTagValue(tags, "orientation");
        if (orientationTag) {
            elOrientation = orientationTag;
        }

        //
        let verticalLayout = dashboardVerticalLayout;
        const layoutTag = getTagValue(tags, "layout");
        if (layoutTag) {
            verticalLayout = layoutTag;
        }

        this.state = {
            pageSlug: slugify(this.props.title),
            elOrientation: elOrientation,
            verticalLayout: verticalLayout,
            classNames: getTagValue(tags, "class", " "),
            loading: false,
            sidebarVisible: initSidebarVisibility,
        };
    }

    collapseCallback = (event) => {
        this.setState({ sidebarVisible: event });
    };

    render() {
        const { classes, sections } = this.props;
        const { sidebarVisible } = this.state;

        // Flip orientation for flex
        let flexDirection =
            this.state.elOrientation == "columns" ? "row" : "column";

        let sidebar;
        let sectionComponents = [];
        if (sections && sections.length > 0) {
            sections.forEach((section, i) => {
                if (section.tags && section.tags.includes("sidebar")) {
                    sidebar = (
                        <Sidebar
                            collapseCallback={this.collapseCallback}
                            {...section}
                        />
                    );
                } else {
                    sectionComponents.push(
                        <Section
                            key={i}
                            pageOrientation={this.state.elOrientation}
                            {...section}
                        />
                    );
                }
            });
        }

        return (
            <Box className={classes.page}>
                <Grid
                    container
                    // spacing={1}
                    className={classes.sections}
                    direction={flexDirection}
                >
                    {sectionComponents}
                </Grid>
            </Box>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Page);
