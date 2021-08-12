# Reference

Reference for all parameters, layouts and tags.

## Parameters

To change the dashboard parameters tag one code cell with the `parameters` or `params`.

| Param | Description | Default |
|---|---|---|
| `flex_title` | Title for the dashboard | notebook file name |
| `flex_orientation` | Orientation for the sections | `columns` - meaning each section is a column and default section orientation is `rows`, meaning each body item is a row |
| `flex_source_code` | Link to the source Notebook on the navbar | `None` |
| `flex_subtitle` | Extra textt to be added on the right of the navbar | `None` |
| `flex_favicon` | Path relative to the notebook with an image to use as favicon | `None` |
| `flex_custom_css` | Path relative to the notebook with a `.css` file to be included | `None` |

!!! info "The `parameter` tag"
    The `parameter` tag is same tag used by [papermill](https://github.com/nteract/papermill) so you can use it as part of you pipeline.

!!! warning "voila and `flex_custom_css`"
    By default Voila doesn't serve all files, see [Serving static files](https://voila.readthedocs.io/en/latest/customize.html#serving-static-files).

    If you are using `flex_custom_css` with voila you need to run it with:

    ```
    voila --template=flex --VoilaConfiguration.file_whitelist="['.*']" notebook.ipynb
    ```

## Layout

| Markdown | Description |
|---|---|
| level-1 header `#` | Defines a new Page, value will be used as name of the page |
| level-2 header `##` | Defines a new Section, value is ignored |
| level-3 header `###` | Defines a new Card, value is the displayed as the card header |

| Tag | Description |
| sidebar` | On a level-1 header defines the global sidebar. On a level-2 header defines the page sidebar |

# Page tags

| Param | Description |
|---|---|
| `orientation={value}` | Overwrite the default orientation for the Section. Possible values: `columns` or `rows` |
| `class=<value>` | The `value` will be added to the Section element as a HTML class name (allows multiple) |

# Section tags

| Param | Description |
|---|---|
| `size={value}` | Grid item size from 1 to 12. See [Material UI Grid](https://material-ui.com/components/grid/) for more info |
| `orientation={value}` | Overwrite the default orientation for the Section. Possible values: `columns` or `rows` |
| `class=<value>` | The `value` will be added to the Section element as a HTML class name (allows multiple) |

# Card tags

| Param | Description |
|---|---|
| `no-header` | Dont show a header for this card. Hides the title and source and info buttons |
| `size={value}` | Grid item size from 1 to 12. See [Material UI Grid](https://material-ui.com/components/grid/) for more info |
| `class=<value>` | The `value` will be added to the Section element as a HTML class name (allows multiple) |

## Cell tags

| Param | Description |
|---|---|
| `body` | Show the output of this cell in the body of the card |
| `footer` | Show the output of this cell in the foote of the card |
| `info` or `help` | Show the output of this cell in the info modal of the card |
| `source` | Add this cell as part of the source code for the card |
| `meta` | Render the values of this cell on the HTML but hidden, useful for adding CSS and JS |
| `size={value}` | Grid item size from 1 to 12. See [Material UI Grid](https://material-ui.com/components/grid/) for more info |
| `class=<value>` | The `value` will be added to the Section element as a HTML class name (allows multiple) |
