import React, { useState } from "react";

import Section from "../Section";

function Sidebar(props) {
    const [collapsed, setCollapsed] = useState(true);
    const { collapseCallback } = props;

    function onCollapse(e) {
        setCollapsed(e.currentTarget.checked);

        if (collapseCallback) {
            collapseCallback(e.currentTarget.checked);
        }
    }

    let contentClass = collapsed ? "" : "collapse";
    let widthClass = collapsed ? "col-md-4 col-lg-2" : "";
    let tooltipText = collapsed ? "Collapse" : "Expand";
    let btnIcon = collapsed ? "chevron_left" : "chevron_right";

    return (
        <>
            <BootstrapNavbar id="sidebar" className={`sidebar ${widthClass}`}>
                <div
                    id={`flex-main-sidebar`}
                    className={`content ${contentClass}`}
                >
                    <Section {...props}></Section>
                </div>

                <OverlayTrigger
                    overlay={<Tooltip>{tooltipText}</Tooltip>}
                    placement="right"
                >
                    <ToggleButton
                        type="checkbox"
                        value="true"
                        className={`collapse-btn`}
                        checked={collapsed}
                        onChange={onCollapse}
                    >
                        <i className="material-icons">{btnIcon}</i>
                    </ToggleButton>
                </OverlayTrigger>
            </BootstrapNavbar>
        </>
    );
}

export default Sidebar;
