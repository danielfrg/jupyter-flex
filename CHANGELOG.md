# jupyter-flex Change Log

## 0.7.0

-   Support Python 3.9
-   Support different layouts for diff pages
-   Move to Material UI from Bootstrap
-   Renamed `flex_home` to `flex_homepage_link`
-   Renamed `flex_source_link` to `flex_external_link`
-   Renamed `flex_include_source` to `flex_show_source`
-   Removed `flex_logo`

## 0.6.4

-   Rename `flex_author` to `flex_subtitle`
-   Added mobile styles so it's a lot more usable now

## 0.6.3

-   Refactor JS modules and release to NPM
-   Multiple small CSS and JS fixes

## 0.6.2

-   Added back the missing flex_logo and flex_favicon options

## 0.6.1

-   Fix include_source behaviour to be the same in Voila and nbconvert

## 0.6.0

-   Moved all Frontend code from the gigantic monster Jinja to React!
-   Replaced `chart` and `text` tags with `body`, tagss reflects better location instead of type
-   Added option to have "scroll" vertical layout, default is the same "fill"
-   Added option to have help button on the card header that shows a modal with cell content
-   Added option to have individual Page sidebars, Global Sidebar is still possible
-   Added better rendering for Sidebars and markdown on body cells
-   Improved rendering of widgets to be one at a time when needed instead of all at once
-   Improved and standardized rendering of multiple data-types
-   Improved Sectioin and Card layout limits when content was bigger than the space available
-   Added option to show the card source cells using `flex_include_source` (default es Voila `strip_source`)
-   Renamed `flex_source_code` to `flex_source_link`, reflects better what it does
-   Fix issue with qgrid by including qgrid.js

## 0.5.0

-   Added the option to have a global sidebar
-   Remove the explict option of section sidebar, still possible useing size tags
-   Improved ipywidgets default styling
-   Added history tabs for the main navigation
-   Added material colors CSS classes for easy customization
-   Support for qgrid widget

## 0.4.0

-   Standardized all parameters with a flex\_ prefix
-   Added flex_subtitle, flex_logo, flex_favicon parameters
-   Added option to include a custom.css file using flex_custom_css
-   Added option to have multiple outputs per card, including markdown cells
-   Added option to add custom CSS classes using `class={value}` tags
-   Changed default theme

## 0.3.0

-   Created a custom NBConvert Exporter: jupyter_flex.NBConvertFlexExporter
-   Added option to link to the source notebook
-   Widgets placeholders now show up on nbconvert html docs
-   Fixed multiple navbar CSS issues

## 0.2.0

-   Support for tab section columns and rows
-   Support for multiple pages
-   General CSS improvements and fixes

## 0.1.0

-   Initial release
-   Support for nbconvert and voila
-   Support for dynamic sections based on markdown and cell tags
