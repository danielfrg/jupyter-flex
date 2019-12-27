SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

all: help

build: assets python  ## Build Python package
assets: download-assets sassc  ## Download and place assets

download-assets:  ## Download .css/.js assets
	@curl -o jupyter_flex/static/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css
	@curl -o jupyter_flex/static/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js
	@curl -o jupyter_flex/static/jquery.min.js https://code.jquery.com/jquery-3.4.1.min.js
	@curl -o jupyter_flex/static/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	@curl -o jupyter_flex/static/embed-amd.js https://unpkg.com/@jupyter-widgets/html-manager@0.18.4/dist/embed-amd.js

sassc:  ## Compile SCSS assets
	@pysassc --style=compressed jupyter_flex/static/flex.scss jupyter_flex/static/flex.min.css

.PHONY: python
python:  ## Build Python package
	python setup.py sdist

.PHONY: upload-pypi
upload-pypi:  ## Upload package to pypi
	twine upload dist/*.tar.gz

.PHONY: upload-test
upload-test:  ## Upload package to pypi test repository
	twine upload --repository testpypi dist/*.tar.gz

.PHONY: clean
clean:  ## Remove build files
	@rm -rf dist
	@rm -rf build
	@rm -rf share
	@rm -rf site
	@rm -rf docs/examples
	@rm -f examples/**/*.html
	@rm -f jupyter_flex/nbconvert_templates/*.js
	@rm -f jupyter_flex/nbconvert_templates/*.css

.PHONY: cleanall
cleanall: clean  ## Clean everything (including downloaded assets)
	@rm -f jupyter_flex/static/*.js
	@rm -f jupyter_flex/static/*.css

.PHONY: env
env:  ## Create virtualenv
	conda env create

.PHONY: netlify
netlify: assets  ## Build docs on Netlify
	pip uninstall -y jupyter-flex
	python setup.py install
	pip freeze
	$(MAKE) docs-examples
	@cd $(CURDIR)/docs/ && jupyter-nbconvert *.ipynb --to=notebook --inplace --execute --ExecutePreprocessor.store_widget_state=True
	mkdocs build --config-file $(CURDIR)/mkdocs.yml

.PHONY: docs-examples
docs-examples:  ## Run nbconvert on the examples
	@cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/customize && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/getting-started && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/layouts && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/widgets && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True

.PHONY: serve-docs
serve-docs:  ## Serve docs
	mkdocs serve

.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
