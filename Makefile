SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

PWD := $(shell pwd)
PYTEST_K ?= ""
TEST_MARKERS ?= "not selenium"

SELENIUM_HUB_HOST ?= 127.0.0.1
SELENIUM_HUB_PORT ?= 4444
PYTEST_BASE_URL ?= http://host.docker.internal:8866


first: help

# ------------------------------------------------------------------------------
# Package build

.PHONY: build
build: download-assets npm-build python-build  ## Build assets and Python package

download-assets:  ## Download .css/.js assets
	@curl -o jupyter_flex/static/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css
	@curl -o jupyter_flex/static/bootstrap.min.css.map https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css.map
	@curl -o jupyter_flex/static/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js
	@curl -o jupyter_flex/static/jquery.min.js https://code.jquery.com/jquery-3.4.1.min.js
	@curl -o jupyter_flex/static/popper.min.js https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js
	@curl -o jupyter_flex/static/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	@curl -o jupyter_flex/static/embed-amd.js https://unpkg.com/@jupyter-widgets/html-manager@0.18.4/dist/embed-amd.js


# ------------------------------------------------------------------------------
# Python

.PHONY: env
env:  ## Create virtualenv
	conda env create


.PHONY: develop
develop:  ## Install package for development
	python -m pip install --no-build-isolation -e .


.PHONY: python-build
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

.PHONY: clean-python
clean-python:  ## Clean Python build files
	@rm -rf build dist site htmlcov .pytest_cache .eggs
	@rm -f .coverage coverage.xml jupyter_flex/_generated_version.py
	@find . -type f -name '*.py[co]' -delete
	@find . -type d -name __pycache__ -exec rm -rf {} +
	@find . -type d -name .ipynb_checkpoints -exec rm -rf {} +
	@rm -rf docs/examples test-results
	@rm -f examples/*.html examples/**/*.html
	@rm -f jupyter_flex/nbconvert_templates/*.js jupyter_flex/nbconvert_templates/*.css


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
	cd js/; npm run dev:voila


.PHONY: clean-js
clean-js:  # Clean JS build files
	rm -rf share/jupyter/voila/templates/flex/static/*.js
	rm -rf share/jupyter/voila/templates/flex/static/*.js.map
	rm -rf share/jupyter/voila/templates/flex/static/*.css
	rm -rf share/jupyter/voila/templates/flex/static/*.css.map
	rm -rf share/jupyter/voila/templates/flex/static/*.html
	rm -rf share/jupyter/voila/templates/flex/static/*.woff
	rm -rf share/jupyter/voila/templates/flex/static/*.woff2
	rm -rf share/jupyter/voila/templates/flex/static/*.eot
	rm -rf share/jupyter/voila/templates/flex/static/*.ttf
	cd js/; rm -rf .cache dist lib


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
		-k $(PYTEST_K) -m $(TEST_MARKERS) --html=test-results/report.html --self-contained-html


.PHONY: test-all
test-all:  ## Run all tests
	mkdir -p test-results/screenshots/customize test-results/screenshots/getting-started test-results/screenshots/layouts test-results/screenshots/plots test-results/screenshots/widgets
	pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(PYTEST_K) --html=test-results/report.html --self-contained-html


.PHONY: test-baselines
test-baselines:  ## Create test baselines
	pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-save-baseline --needle-baseline-dir docs/assets/img/screenshots \
		-k $(PYTEST_K)


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
# Other

.PHONY: cleanall
cleanall: clean-python clean-js  ## Clean everything
	@rm -rf *.egg-info
	@cd js/; rm -rf node_modules

.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
