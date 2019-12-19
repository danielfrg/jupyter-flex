SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

all: help

assets: download-assets sassc copy-static  ## Download and place assets
build: assets python  ## Build Python package

download-assets:  ## Download .css/.js assets
	@curl -o jupyter_flex/static/jquery.min.js https://code.jquery.com/jquery-3.4.1.min.js
	@curl -o jupyter_flex/static/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	@curl -o jupyter_flex/static/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css

sassc:  ## Compile SCSS assets
	@pysassc --style=compressed jupyter_flex/static/flex.scss jupyter_flex/static/flex.min.css
	@pysassc --style=compressed jupyter_flex/static/flex-overwrite.scss jupyter_flex/static/flex-overwrite.min.css

copy-static:  ## Copy static assets to nbconvert_templates
	@cp jupyter_flex/static/flex.min.css jupyter_flex/nbconvert_templates/flex.min.css
	@cp jupyter_flex/static/flex-overwrite.min.css jupyter_flex/nbconvert_templates/flex-overwrite.min.css
	@cp jupyter_flex/static/bootstrap.min.css jupyter_flex/nbconvert_templates/flex-bootstrap.min.css
	@cp jupyter_flex/static/jquery.min.js jupyter_flex/nbconvert_templates/flex-jquery.min.js
	@cp jupyter_flex/static/require.min.js jupyter_flex/nbconvert_templates/flex-require.min.js

.PHONY: python
python:  ## Build Python package
	python setup.py sdist

.PHONY: upload
upload:  ## Upload package to pypi
	twine upload dist/*.tar.gz

.PHONY: upload-test
upload-test:  ## Upload package to pypi test repository
	twine upload --repository testpypi dist/*.tar.gz

.PHONY: clean
clean:  ## Remove build files
	@rm -rf dist
	@rm -rf site
	@rm -r examples/**/*.html
	@rm -f jupyter_flex/static/*.js
	@rm -f jupyter_flex/static/*.css
	@rm -f jupyter_flex/nbconvert_templates/*.js
	@rm -f jupyter_flex/nbconvert_templates/*.css

.PHONY: env
env:  ## Create virtualenv
	conda env create

.PHONY: docs
docs:  ## Build docs
	mkdocs build

.PHONY: serve-docs
serve-docs:  ## Serve docs
	mkdocs serve

.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
