# Reference

Reference for all parameters, layouts and tags.

## Parameters

To change the dashboard parameters tag one code cell with the `parameters`.

| Param | Description | Default |
|---|---|---|
| `flex_title` | Title for the dashboard | nbconvert: notebook file name<br>voila: *"Notebook"* |
| `flex_orientation` | Orientation for the sections | `columns`, each section as one column<br>Default section orientation is `rows`, each chart as a row |
| `flex_source_code` | Link to the source Notebook on the navbar | `None` |
| `flex_author` | Author name to be added on the navbar | `None` |
| `flex_logo` | Path relative to the notebook with an image to add left of the title | `None` |
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

| Param | Description |
|---|---|
| level-1 header `#` | Defines a new Page, value will be used as name of the page |
| level-2 header `##` | Defines a new Section, value is ignored |
| level-3 header `###` | Defines a new Chart that is displayed as a card, value is the card header |

## Tags

| Param | Description |
|---|---|
| `body` | Show the output of this cell on the current section as a card |
| `footer` | Show the output of this cell on the current card footer, should go in a cell after a `body` tag |
| `sidebar` | Show the output of this cell as a sidebar for the current page, usually used with ipywidgets |
| `meta` | Render the values of this cell on the html but hidden, useful for adding CSS and JS |
| `orientation={value}` | Overwrite the default orientation for the page (level-1 header) and section (level-2 header) |
| `size={value}` | Proportion size of the current section or chart with respect to its sibilings, default: `500` |
