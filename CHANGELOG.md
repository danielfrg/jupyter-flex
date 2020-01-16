# Jupyter-flex Change Log

## [Unreleased]

- Added option to have "scroll" vertical layout, default is the same "fill"
- Added kernel activity and status information to the navbar when using Voila
- Added option to have help button on the card header that shows one markdown cell as a popover
- Bundle now includes Popper.js for tooltips and popovers

## [0.5.0]

- Added the option to have a global sidebar
- Remove the explict option of section sidebar, still possible useing size tags
- Improved ipywidgets default styling
- Added history tabs for the main navigation
- Added material colors CSS classes for easy customization
- Support for qgrid widget

## 0.4.0

- Standardized all parameters with a flex_ prefix
- Added flex_author, flex_logo, flex_favicon parameters
- Added option to include a custom.css file using flex_custom_css
- Added option to have multiple outputs per card, including markdown cells
- Added option to add custom CSS classes using `class={value}` tags
- Changed default theme

## 0.3.0

- Created a custom NBConvert Exporter: jupyter_flex.NBConvertFlexExporter
- Added option to link to the source notebook
- Widgets placeholders now show up on nbconvert html docs
- Fixed multiple navbar CSS issues

## 0.2.0

- Support for tab section columns and rows
- Support for multiple pages
- General CSS improvements and fixes

## 0.1.0

- Initial release
- Support for nbconvert and voila
- Support for dynamic sections based on markdown and cell tags
