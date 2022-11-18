SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
.DEFAULT_GOAL := help

PYTEST_K ?= ""
PYTEST_MARKERS ?= "not selenium"

SELENIUM_HUB_HOST ?= 127.0.0.1
SELENIUM_HUB_PORT ?= 4444
PYTEST_BASE_URL ?= http://localhost:8866
# For selenium running in Docker to access the host
# PYTEST_BASE_URL ?= http://host.docker.internal:8866


all: npm-build pkg  ## Build JS and Python


# ------------------------------------------------------------------------------
# Python

env:  ## Create Python env
	cd $(CURDIR)/python; poetry install --with dev --with test --with examples


pkg:  ## Build package
	cd $(CURDIR)/python; poetry build


check:  ## Check linting
	cd $(CURDIR)/python; isort . --check-only --diff
	cd $(CURDIR)/python; black . --check
	cd $(CURDIR)/python; flake8


fmt:  ## Format source
	cd $(CURDIR)/python; isort .
	cd $(CURDIR)/python; black .


upload-pypi:  ## Upload package to PyPI
	cd $(CURDIR)/python; twine upload dist/*.tar.gz


cleanpython:  ## Clean Python build files
	cd $(CURDIR)/python; rm -rf .pytest_cache dist htmlcov test-results
	cd $(CURDIR)/python; rm -f .coverage coverage.xml
	find . -type f -name '*.py[co]' -delete
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .ipynb_checkpoints -exec rm -rf {} +


resetpython: cleanpython  ## Reset Python
	cd $(CURDIR)/python; rm -rf .venv


download-testdata:  ## Download test data
	bokeh sampledata


example:  ## Dev: Run nbconvert on one example
	cd $(CURDIR)/examples && jupyter-nbconvert illusionist/widget-gallery.ipynb --output-dir=$(CURDIR)/docs/examples/illusionist --to=flex-illusionist --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True


# ------------------------------------------------------------------------------
# Javascript

npm-install:  ## JS: Install dependencies
	cd $(CURDIR)/js; npm install
npm-i: npm-install


npm-build:  ## JS: Build
	cd $(CURDIR)/js; npm run build


npm-dev:  ## JS: Build dev mode
	cd $(CURDIR)/js; npm run dev


npm-publish:  ## JS: Publish to NPM
	cd $(CURDIR)/js; npm version
	cd $(CURDIR)/js; npm publish


cleanjs:  ## JS: Clean build files
	cd $(CURDIR)/js; npm run clean
	cd $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/; rm -rf *.js* *.css* *.txt


resetjs:  ## JS: Reset
	cd $(CURDIR)/js; npm run reset


download-assets:  ## Download .css/.js assets
	curl -o $(CURDIR)/python/jupyter_flex/templates/nbconvert/flex/static/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	# We need to include qgrid because of: http://github.com/quantopian/qgrid/pull/325
	# We need to put it directly on `static` so requireJS can find it
	curl -o $(CURDIR)/python/jupyter_flex/templates/nbconvert/flex/static/qgrid.js https://unpkg.com/qgrid2@1.1.3/dist/index.js


# ------------------------------------------------------------------------------
# Testing

selenium:  ## Test: Run selenium
	selenium-server -port 4444


selenium-docker:  ## Test:  Run selenium in docker
	docker-compose up


voila-examples:  ## Test: Serve examples using voila
	jupyter-flex $(CURDIR)/examples --VoilaConfiguration.file_whitelist '.*'


test-%:  ## Run tests
	cd $(CURDIR)/python; PYTEST_BASE_URL=$(PYTEST_BASE_URL) \
	pytest -k $(PYTEST_K) -m $(subst test-,,$@) \
		--splinter-webdriver remote \
		--splinter-remote-url $(SELENIUM_HUB_HOST) \
		--html=test-results/report.html --self-contained-html


test-all:  ## Run all tests
	cd $(CURDIR)/python; PYTEST_BASE_URL=$(PYTEST_BASE_URL) \
	pytest \
		--splinter-webdriver remote \
		--splinter-remote-url $(SELENIUM_HUB_HOST) \
		--html=test-results/report.html --self-contained-html


test-gen-baselines:  ## Generate/update test baselines
	cd $(CURDIR)/python; pytest --driver Remote --selenium-host $(SELENIUM_HUB_HOST) --selenium-port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-save-baseline --needle-baseline-dir $(CURDIR)/docs/assets/img/screenshots \
		-s -k $(PYTEST_K)


report:  ## Test: Generate coverage reports
	cd $(CURDIR)/python; coverage xml
	cd $(CURDIR)/python; coverage html


nbconvert-example:
	cd $(CURDIR)/examples && jupyter-nbconvert widgets/ipyleaflet.ipynb --to=flex --output-dir=$(CURDIR)/docs/examples --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True


# ------------------------------------------------------------------------------
# Docs

docs:  ## Docs: Build
	$(MAKE) docs-examples-html
	mkdocs build
	# This one after building
	$(MAKE) docs-example-exec-nbs
.PHONY: docs


docs-serve:  ## Docs: Serve
	mkdocs serve


docs-examples-html:  ## Docs: Convert examples to HTML dashboards
	rm -rf $(CURDIR)/docs/examples;
	cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb 						--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True
	cd $(CURDIR)/examples && jupyter-nbconvert docs/*.ipynb	 				--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert layouts/*.ipynb 				--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert layouts/customize/*.ipynb 	--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert plots/*.ipynb 				--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert widgets/*.ipynb 				--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert illusionist/*.ipynb 			--output-dir=$(CURDIR)/docs/examples/illusionist --to=flex-illusionist --execute --ExecutePreprocessor.store_widget_state=True


docs-example-exec-nbs:  ## Docs: Execute examples and output them into docs
	rm -rf $(CURDIR)/site/examples/notebooks
	cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb 		      		  	--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True
	cd $(CURDIR)/examples && jupyter-nbconvert docs/*.ipynb 				--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert layouts/*.ipynb 				--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert layouts/customize/*.ipynb	--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert plots/*.ipynb 				--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert widgets/*.ipynb 				--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert illusionist/*.ipynb 			--output-dir=$(CURDIR)/site/examples/notebooks/illusionist --to=illusionist-nb --execute --ExecutePreprocessor.store_widget_state=True


examples-clear-output:  ## Clear output of notebooks
	cd $(CURDIR)/examples && jupyter nbconvert */*.ipynb --clear-output --inplace


# ------------------------------------------------------------------------------
# Other

cleanall: cleanjs cleanpython  ## Clean everything
	rm -rf site $(CURDIR)/docs/examples
	rm -f $(CURDIR)/examples/*.html $(CURDIR)/examples/**/*.html


resetall: resetjs resetpython  ## Reset environment


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
