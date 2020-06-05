import React from "react";
import { create } from "react-test-renderer";

import Output from "../Output";

test("empty", () => {
    const c = create(<Output />);
    expect(c.toJSON()).toMatchSnapshot();
});

// test("png", () => {
//     const c = create(<Output data={} />);
//     expect(c.toJSON()).toMatchSnapshot();
// });
