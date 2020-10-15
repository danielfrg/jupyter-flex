import React from "react";

import Card from "../Card";
import Section from "../Section";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="sidebar" className="collapse sidebar col-md-4 col-lg-2">
                <Section {...this.props}></Section>
            </div>
        );
    }
}

export default Sidebar;
