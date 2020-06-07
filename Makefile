SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

PWD := $(shell pwd)
TEST_FILTER ?= ""
TEST_MARKERS ?= "not selenium"

SELENIUM_HUB_HOST ?= 127.0.0.1
SELENIUM_HUB_PORT ?= 4444
PYTEST_BASE_URL ?= http://host.docker.internal:8866


first: help

.PHONY: clean
clean:  ## Clean build files
	@rm -rf build dist site htmlcov .pytest_cache .eggs
	@rm -f .coverage coverage.xml jupyter_flex/_generated_version.py
	@find . -type f -name '*.py[co]' -delete
	@find . -type d -name __pycache__ -exec rm -rf {} +
	@find . -type d -name .ipynb_checkpoints -exec rm -rf {} +
	@rm -rf docs/examples test-results
	@rm -f examples/*.html examples/**/*.html
	@rm -f jupyter_flex/nbconvert_templates/*.js jupyter_flex/nbconvert_templates/*.css


.PHONY: cleanall
cleanall: clean  ## Clean everything
	@rm -rf *.egg-info
	@rm -rf share
	@rm -f jupyter_flex/static/*.css
	@rm -f jupyter_flex/static/*.css.map
	@ls jupyter_flex/static/*.js | grep -v flex.js | xargs rm


.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'


# ------------------------------------------------------------------------------
# Package build

.PHONY: env
env:  ## Create virtualenv
	conda env create


.PHONY: develop
develop:  ## Install package for development
	python -m pip install --no-build-isolation -e .


.PHONY: build
build: npm-build package  ## Build assets and Python package


.PHONY: package
package:  ## Build Python package (sdist)
	python setup.py sdist


.PHONY: check
check:  ## Check linting
	@flake8
	@isort --check-only --diff --recursive --project jupyter_flex --section-default THIRDPARTY .
	@black --check .


.PHONY: fmt
fmt:  ## Format source
	@isort --recursive --project jupyter-flex --section-default THIRDPARTY .
	@black .


.PHONY: upload-pypi
upload-pypi:  ## Upload package to PyPI
	twine upload dist/*.tar.gz


.PHONY: upload-test
upload-test:  ## Upload package to test PyPI
	twine upload --repository test dist/*.tar.gz


# ------------------------------------------------------------------------------
# Testing

.PHONY: selenium
selenium:  ## Run selenium in docker-compose
	docker-compose up


.PHONY: serve-examples
serve-examples:  ## Serve examples using voila
	voila --debug --template flex --no-browser --Voila.ip='0.0.0.0' --port 8866 --VoilaConfiguration.file_whitelist="['.*']" $(CURDIR)/examples


.PHONY: test
test:  ## Run tests
	mkdir -p test-results/screenshots/customize test-results/screenshots/getting-started test-results/screenshots/layouts test-results/screenshots/plots test-results/screenshots/widgets
	pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(TEST_FILTER) -m $(TEST_MARKERS) --html=test-results/report.html --self-contained-html


.PHONY: test-all
test-all:  ## Run all tests
	mkdir -p test-results/screenshots/customize test-results/screenshots/getting-started test-results/screenshots/layouts test-results/screenshots/plots test-results/screenshots/widgets
	pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(TEST_FILTER) --html=test-results/report.html --self-contained-html


.PHONY: test-baseline
test-baselines:  ## Create test baselines
	pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-save-baseline --needle-baseline-dir docs/assets/img/screenshots \
		-k $(TEST_FILTER)


.PHONY: report
report:  ## Generate coverage reports
	@coverage xml
	@coverage html

# ------------------------------------------------------------------------------
# Docs

.PHONY: docs
docs: docs-examples  ## mkdocs build
	mkdocs build --config-file $(CURDIR)/mkdocs.yml


.PHONY: docs-examples
docs-examples:  ## Run nbconvert on the examples
	@cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/customize && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/getting-started && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/plots && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/layouts && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/widgets && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True


.PHONY: serve-docs
serve-docs:  ## Serve docs
	mkdocs serve


.PHONY: netlify
netlify: assets  ## Build docs on Netlify
	python setup.py install
	pip freeze
	python -c "import bokeh.sampledata; bokeh.sampledata.download()"
	pushd $(CURDIR)/docs && jupyter-nbconvert *.ipynb --to=notebook --inplace --execute --ExecutePreprocessor.store_widget_state=True && popd
	$(MAKE) docs

# ------------------------------------------------------------------------------
# JS

.PHONY: npm-install
npm-install:  ## Install JS dependencies
	cd js/; npm install


.PHONY: npm-build
npm-build:  ## Build JS
	cd js/; npm run build


.PHONY: npm-dev
npm-dev:  ## Build JS with watch
	cd js/; npm run dev


.PHONY: clean-js
clean-js:  # Clean JS
	rm -rf share/jupyter/voila/templates/flex/static/*.js
	rm -rf share/jupyter/voila/templates/flex/static/*.js.map
	rm -rf share/jupyter/voila/templates/flex/static/*.css
	rm -rf share/jupyter/voila/templates/flex/static/*.css.map
	rm -rf share/jupyter/voila/templates/flex/static/*.html
	rm -rf share/jupyter/voila/templates/flex/static/*.svg
	rm -rf share/jupyter/voila/templates/flex/static/*.woff
	rm -rf share/jupyter/voila/templates/flex/static/*.woff2
	rm -rf share/jupyter/voila/templates/flex/static/*.eot
	rm -rf share/jupyter/voila/templates/flex/static/*.ttf
	cd js/; rm -rf .cache dist lib


.PHONY: reset-js
reset-js: clean-js  # Clean JS including node_modules
	cd js/; rm -rf node_modules
