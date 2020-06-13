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

build: download-assets npm-build python-build  ## Build assets and Python package

download-assets:  ## Download .css/.js assets
	curl -o python/share/jupyter/voila/templates/flex/static/dist/jquery-3.5.1.slim.min.js https://code.jquery.com/jquery-3.5.1.slim.min.js
	curl -o python/share/jupyter/voila/templates/flex/static/dist/bootstrap-4.5.0.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js
	curl -o python/share/jupyter/voila/templates/flex/static/dist/bootstrap.min.js.map https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js.map
	curl -o python/share/jupyter/voila/templates/flex/static/dist/bootstrap-4.5.0.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css
	curl -o python/share/jupyter/voila/templates/flex/static/dist/bootstrap.min.css.map https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css.map
	curl -o python/share/jupyter/voila/templates/flex/static/dist/require-2.3.6.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	# We need to include qgrid because of: https://github.com/quantopian/qgrid/pull/325
	# We also put it directly on static so its requireJS can find it
	curl -o python/share/jupyter/voila/templates/flex/static/qgrid.js https://unpkg.com/qgrid2@1.1.3/dist/index.js


# ------------------------------------------------------------------------------
# Python

python-build:  ## Build Python package (sdist)
	cd python; python setup.py sdist


env:  ## Create virtualenv
	cd python; conda env create


develop:  ## Install package for development
	cd python; python -m pip install --no-build-isolation -e .


extensions:
	# cd python; jupyter nbextension enable --py --sys-prefix widgetsnbextension
	# cd python; jupyter nbextension enable --py --sys-prefix ipyleaflet
	# cd python; jupyter nbextension enable --py --sys-prefix qgrid
	cd python; jupyter labextension install @jupyter-widgets/jupyterlab-manager jupyter-leaflet
	cd python; jupyter labextension install @jupyter-voila/jupyterlab-preview


check:  ## Check linting
	cd $(CURDIR)/python; flake8
	cd $(CURDIR)/python; isort --check-only --diff --recursive --project jupyter_flex --section-default THIRDPARTY .
	cd $(CURDIR)/python; black --check .


fmt:  ## Format source
	cd python; isort --recursive --project jupyter-flex --section-default THIRDPARTY .
	cd python; black .


upload-pypi:  ## Upload package to PyPI
	cd python; twine upload dist/*.tar.gz


.PHONY: upload-test
upload-test:  ## Upload package to test PyPI
	cd python; twine upload --repository test dist/*.tar.gz


cleanpython:  ## Clean Python build files
	cd python; rm -rf build dist htmlcov .pytest_cache test-results .eggs
	cd python; rm -f .coverage coverage.xml jupyter_flex/_generated_version.py
	cd python; find . -type f -name '*.py[co]' -delete
	cd python; find . -type d -name __pycache__ -exec rm -rf {} +
	cd python; find . -type d -name .ipynb_checkpoints -exec rm -rf {} +
	rm -rf site docs/examples
	rm -f examples/*.html examples/**/*.html


# ------------------------------------------------------------------------------
# JS

npm-build:  ## Build JS
	cd js/; npm run build


npm-dev:  ## Build JS with watch
	cd js/; npm run dev


npm-install:  ## Install JS dependencies
	cd js/; npm install


cleanjs:  ## Clean JS build files
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.js
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.js.map
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.css
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.css.map
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.html
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.woff
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.woff2
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.eot
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.ttf
	rm -rf python/share/jupyter/voila/templates/flex/static/dist/*.svg
	cd js/; rm -rf .cache dist lib


# ------------------------------------------------------------------------------
# Testing

selenium:  ## Run selenium in docker-compose
	docker-compose up


voila-examples:  ## Serve examples using voila
	voila --debug --template flex --no-browser --Voila.ip='0.0.0.0' --port 8866 --VoilaConfiguration.file_whitelist="['.*']" $(CURDIR)/examples


test:  ## Run tests
	cd python; mkdir -p test-results/screenshots/customize test-results/screenshots/getting-started test-results/screenshots/layouts test-results/screenshots/plots test-results/screenshots/widgets
	cd python; pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(PYTEST_K) -m $(TEST_MARKERS) --html=test-results/report.html --self-contained-html


test-all:  ## Run all tests
	cd python; mkdir -p test-results/screenshots/customize test-results/screenshots/getting-started test-results/screenshots/layouts test-results/screenshots/plots test-results/screenshots/widgets
	cd python; pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(PYTEST_K) --html=test-results/report.html --self-contained-html


test-baselines:  ## Create test baselines
	cd python; pytest --driver Remote --headless --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-save-baseline --needle-baseline-dir docs/assets/img/screenshots \
		-k $(PYTEST_K)


report:  ## Generate coverage reports
	cd python; coverage xml
	cd python; coverage html


# ------------------------------------------------------------------------------
# Docs

.PHONY: docs
docs: docs-examples  ## mkdocs build
	mkdocs build --config-file $(CURDIR)/mkdocs.yml


docs-nbs:  ## Convert notebooks inside docs
	cd $(CURDIR)/docs && jupyter-nbconvert *.ipynb --to=notebook --inplace --execute --ExecutePreprocessor.store_widget_state=True


docs-examples:  ## Run nbconvert on the examples
	cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert customize/*.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert getting-started/*.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert plots/*.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert layouts/*.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert widgets/*.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True


serve-docs:  ## Serve docs
	mkdocs serve


# ------------------------------------------------------------------------------
# Other

cleanall: cleanpython cleanjs  ## Clean everything
	rm -rf *.egg-info
	cd js/; rm -rf node_modules


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
