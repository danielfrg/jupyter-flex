SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

all: help

build: download-assets sassc copy-static python

download-assets:  ## Download .css/.js assets
	@curl -o flex/static/jquery.min.js https://code.jquery.com/jquery-3.4.1.min.js
	@curl -o flex/static/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	@curl -o flex/static/bootstrap.min.css https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css

sassc:  ## Compile SCSS assets
	@pysassc --style=compressed flex/static/flex.scss flex/static/flex.min.css
	@pysassc --style=compressed flex/static/flex-overwrite.scss flex/static/flex-overwrite.min.css

copy-static:  ## Copy static assets to nbconvert_templates
	@cp flex/static/flex.min.css flex/nbconvert_templates/flex.min.css
	@cp flex/static/flex-overwrite.min.css flex/nbconvert_templates/flex-overwrite.min.css
	@cp flex/static/bootstrap.min.css flex/nbconvert_templates/flex-bootstrap.min.css
	@cp flex/static/jquery.min.js flex/nbconvert_templates/flex-jquery.min.js
	@cp flex/static/require.min.js flex/nbconvert_templates/flex-require.min.js

python:  ## TODO

clean:  ## Remove build files
	@rm -f dist
	@rm -f flex/static/*.js
	@rm -f flex/static/*.css
	@rm -f flex/nbconvert_templates/*.js
	@rm -f flex/nbconvert_templates/*.css

help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
.PHONY: help
