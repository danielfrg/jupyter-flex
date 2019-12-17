SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

all: help

copy-static:  ## Copy static assets to nbconvert_templates
	@cp flex/static/flex.min.css flex/nbconvert_templates/flex.min.css
	@cp flex/static/flex-overwrite.min.css flex/nbconvert_templates/flex-overwrite.min.css
	@cp flex/static/boostrap.min.css flex/nbconvert_templates/flex-bootstrap.min.css
	@cp flex/static/require.min.js flex/nbconvert_templates/flex-require.min.js


clean:  ##
	@rm flex/nbconvert_templates/*.js
	@rm flex/nbconvert_templates/*.css

help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
.PHONY: help
