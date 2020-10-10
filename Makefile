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
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/jquery.slim.min.js https://code.jquery.com/jquery-3.5.1.slim.min.js
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/bootstrap.min.js.map https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js.map
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/bootstrap.min.css.map https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css.map
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	# We need to include qgrid because of: http://github.com/quantopian/qgrid/pull/325
	# We need to put it directly on static so requireJS can find it
	curl -o $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/qgrid.js https://unpkg.com/qgrid2@1.1.3/dist/index.js


# ------------------------------------------------------------------------------
# Python

python-build:  ## Build Python package (sdist)
	cd $(CURDIR)/python; python setup.py sdist


env:  ## Create virtualenv
	conda env create


develop:  ## Install package for development
	cd $(CURDIR)/python; python -m pip install --no-build-isolation -e .


extensions:  ## Install Jupyter extensions
	# cd $(CURDIR)/python; jupyter nbextension enable --py --sys-prefix widgetsnbextension
	# cd $(CURDIR)/python; jupyter nbextension enable --py --sys-prefix ipyleaflet
	# cd $(CURDIR)/python; jupyter nbextension enable --py --sys-prefix qgrid
	cd $(CURDIR)/python; jupyter labextension install @jupyter-widgets/jupyterlab-manager jupyter-leaflet
	cd $(CURDIR)/python; jupyter labextension install @jupyter-voila/jupyterlab-preview
	cd $(CURDIR)/python; jupyter labextension install ipysheet


check:  ## Check linting
	cd $(CURDIR)/python; flake8
	cd $(CURDIR)/python; isort --check-only --diff --recursive --project jupyter_flex --section-default THIRDPARTY .
	cd $(CURDIR)/python; black --check .


fmt:  ## Format source
	cd $(CURDIR)/python; isort --recursive --project jupyter-flex --section-default THIRDPARTY .
	cd $(CURDIR)/python; black .


upload-pypi:  ## Upload package to PyPI
	cd $(CURDIR)/python; twine upload dist/*.tar.gz


upload-test:  ## Upload package to test PyPI
	cd $(CURDIR)/python; twine upload --repository test dist/*.tar.gz


cleanpython:  ## Clean Python build files
	cd $(CURDIR)/python; rm -rf build dist htmlcov .pytest_cache test-results .eggs
	cd $(CURDIR)/python; rm -f .coverage coverage.xml jupyter_flex/_generated_version.py
	find . -type f -name '*.py[co]' -delete
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .ipynb_checkpoints -exec rm -rf {} +
	rm -rf site docs/examples
	rm -f examples/*.html examples/**/*.html


# ------------------------------------------------------------------------------
# JS

npm-build:  ## Build JS
	cd $(CURDIR)/js/; npm run build:all


npm-i: npm-install
npm-install:  ## Install JS dependencies
	cd $(CURDIR)/js/; npm install


npm-dev:  ## Build JS with watch
	cd $(CURDIR)/js/; npm run dev


npm-publish:  ## Publish NPM
	cd $(CURDIR)/js/; npm version
	cd $(CURDIR)/js/; npm publish


cleanjs:  ## Clean JS build files
	cd $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/dist/; find . ! -name '.gitignore' -type f -exec rm -f {} +
	cd $(CURDIR)/python/share/jupyter/nbconvert/templates/flex/static/'; rm -rf qgrid.js
	cd $(CURDIR)/js/; rm -rf .cache dist lib


# ------------------------------------------------------------------------------
# Testing

selenium:  ## Run selenium in docker-compose
	docker-compose up


voila-examples:  ## Serve examples using voila
	voila --debug --template flex --no-browser --Voila.ip='0.0.0.0' --port 8866 --VoilaConfiguration.file_whitelist="['.*']" $(CURDIR)/examples


test-setup:
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/customize
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/demos
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/getting-started
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/illusionist
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/layouts
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/plots
	cd $(CURDIR)/python; mkdir -p test-results/screenshots/widgets


test: test-setup  ## Run tests
	cd $(CURDIR)/python; pytest --driver Remote --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir $(CURDIR)/docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(PYTEST_K) -m $(TEST_MARKERS) --html=test-results/report.html --self-contained-html


test-all: test-setup  ## Run all tests
	cd $(CURDIR)/python; pytest --driver Remote --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-baseline-dir $(CURDIR)/docs/assets/img/screenshots --needle-output-dir test-results/screenshots \
		-k $(PYTEST_K) --html=test-results/report.html --self-contained-html


test-baselines:  ## Create test baselines
	cd $(CURDIR)/python; pytest --driver Remote --host $(SELENIUM_HUB_HOST) --port $(SELENIUM_HUB_PORT) --capability browserName chrome \
		--base-url $(PYTEST_BASE_URL) --needle-save-baseline --needle-baseline-dir $(CURDIR)/docs/assets/img/screenshots \
		-s -k $(PYTEST_K)


report:  ## Generate coverage reports
	cd $(CURDIR)/python; coverage xml
	cd $(CURDIR)/python; coverage html


nbconvert-example:  ## Run nbconver on one example
	cd $(CURDIR)/examples && jupyter-nbconvert widgets/ipyleaflet.ipynb --to=flex --output-dir=$(CURDIR)/docs/examples --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True


# ------------------------------------------------------------------------------
# Docs

.PHONY: docs
docs: docs-examples-html  ## mkdocs build
	mkdocs build
	$(MAKE) docs-exec-notebooks


serve-docs:  ## Serve docs
	mkdocs serve


docs-examples-html:  ## Convert examples to HTML dashboards
	rm -rf $(CURDIR)/docs/examples;
	# cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb 					--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert customize/*.ipynb 		--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	# cd $(CURDIR)/examples && jupyter-nbconvert demos/*.ipynb 			--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True
	# cd $(CURDIR)/examples && jupyter-nbconvert getting-started/*.ipynb 	--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	# cd $(CURDIR)/examples && jupyter-nbconvert plots/*.ipynb 			--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	# cd $(CURDIR)/examples && jupyter-nbconvert layouts/*.ipynb 			--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	# cd $(CURDIR)/examples && jupyter-nbconvert widgets/*.ipynb 			--output-dir=$(CURDIR)/docs/examples --to=flex --execute --ExecutePreprocessor.store_widget_state=True
	# cd $(CURDIR)/examples && jupyter-nbconvert illusionist/*.ipynb 		--output-dir=$(CURDIR)/docs/examples/illusionist --to=flex-illusionist --execute --ExecutePreprocessor.store_widget_state=True


docs-exec-notebooks:  ## Execute example notebooks into docs output
	rm -rf $(CURDIR)/site/examples/notebooks
	cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb 		        	--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert customize/*.ipynb		--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert demos/*.ipynb 			--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True --ExecutePreprocessor.allow_errors=True
	cd $(CURDIR)/examples && jupyter-nbconvert getting-started/*.ipynb 	--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert plots/*.ipynb 			--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert layouts/*.ipynb 			--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert widgets/*.ipynb 			--output-dir=$(CURDIR)/site/examples/notebooks --to=notebook --execute --ExecutePreprocessor.store_widget_state=True
	cd $(CURDIR)/examples && jupyter-nbconvert illusionist/*.ipynb 		--output-dir=$(CURDIR)/site/examples/notebooks/illusionist --to=illusionist-nb --execute --ExecutePreprocessor.store_widget_state=True


examples-clear-output:  ## Clear output of notebooks
	cd $(CURDIR)/examples && jupyter nbconvert */*.ipynb --clear-output --inplace


# ------------------------------------------------------------------------------
# Other

reset: cleanall  ## Same as cleanall
cleanall: cleanpython cleanjs  ## Clean everything
	rm -rf *.egg-info
	cd $(CURDIR)/js/; rm -rf node_modules


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
