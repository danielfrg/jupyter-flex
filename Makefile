SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

TEST_FILTER ?= ""
NEEDLE_ENGINE ?= imagemagick
ifdef CIRCLECI
    NEEDLE_ENGINE = imagemagick
endif

all: help

.PHONY: clean
clean:  ## Remove build files
	@rm -rf dist
	@rm -rf build
	@rm -rf share
	@rm -rf site
	@rm -rf docs/examples
	@rm -f examples/*.html
	@rm -f examples/**/*.html
	@rm -f jupyter_flex/nbconvert_templates/*.js
	@rm -f jupyter_flex/nbconvert_templates/*.css
	@rm -rf test-results

.PHONY: cleanall
cleanall: clean  ## Clean everything. Includes downloaded assets and NB checkpoints
	@ls jupyter_flex/static/*.js | grep -v flex.js | xargs rm
	@rm -f jupyter_flex/static/*.css
	@rm -rf **/.ipynb_checkpoints

.PHONY: env
env:  ## Create virtualenv
	conda env create

assets: download-assets sassc  ## Download and compile assets

download-assets:  ## Download .css/.js assets
	@curl -o jupyter_flex/static/bootstrap.min.css https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css
	@curl -o jupyter_flex/static/bootstrap.min.css.map https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css.map
	@curl -o jupyter_flex/static/bootstrap.min.js https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js
	@curl -o jupyter_flex/static/jquery.min.js https://code.jquery.com/jquery-3.4.1.min.js
	@curl -o jupyter_flex/static/popper.min.js https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js
	@curl -o jupyter_flex/static/require.min.js https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
	@curl -o jupyter_flex/static/embed-amd.js https://unpkg.com/@jupyter-widgets/html-manager@0.18.4/dist/embed-amd.js

sassc:  ## Compile SCSS assets
	@pysassc --style=compressed jupyter_flex/static/flex.scss jupyter_flex/static/flex.min.css

build: assets package  ## Download assets, compile and build Python package

.PHONY: package
package:  ## Build Python package
	python setup.py sdist

.PHONY: upload-pypi
upload-pypi:  ## Upload package to pypi
	twine upload dist/*.tar.gz

.PHONY: upload-test
upload-test:  ## Upload package to pypi test repository
	twine upload --repository testpypi dist/*.tar.gz

###############################################################################
# Testing
###############################################################################

.PHONY: test-assets
test-assets:  ## Download test assets (browser drivers)
	@mkdir -p bin
	@curl -f -L -o bin/geckodriver.tar.gz https://github.com/mozilla/geckodriver/releases/download/v0.26.0/geckodriver-v0.26.0-macos.tar.gz
	@cd bin && tar -zxvf geckodriver.tar.gz
	@curl -f -L -o bin/chromedriver.zip https://chromedriver.storage.googleapis.com/79.0.3945.36/chromedriver_mac64.zip
	@cd bin && unzip chromedriver.zip

.PHONY: serve-voila
serve-voila:  ## Serve examples using voila
	voila --debug --template flex --no-browser --port 8866 --VoilaConfiguration.file_whitelist="['.*']" $(CURDIR)/examples

.PHONY: test tests
tests: test
test:  ## Run tests
	mkdir -p test-results/screenshots/customize test-results/screenshots/getting-started test-results/screenshots/layouts test-results/screenshots/plots test-results/screenshots/widgets
	pytest -vvv jupyter_flex/tests -k $(TEST_FILTER) --driver Chrome --headless --html=test-results/report.html --self-contained-html --needle-baseline-dir docs/assets/img/screenshots --needle-engine $(NEEDLE_ENGINE) --needle-output-dir test-results/screenshots

.PHONY: test-baseline tests-baseline
test-baseline: test-baseline
test-baseline:  ## Create tests baselines
	pytest -vvv jupyter_flex/tests -k $(TEST_FILTER) --driver Chrome --headless --needle-save-baseline --needle-baseline-dir docs/assets/img/screenshots

###############################################################################
# Docs
###############################################################################

.PHONY: serve-docs
serve-docs:  ## Serve docs
	mkdocs serve

.PHONY: docs-examples
docs-examples:  ## Run nbconvert on the examples
	@cd $(CURDIR)/examples && jupyter-nbconvert *.ipynb --to=flex --output-dir=../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/customize && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/getting-started && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/plots && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/layouts && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True
	@cd $(CURDIR)/examples/widgets && jupyter-nbconvert *.ipynb --to=flex --output-dir=../../docs/examples --execute --ExecutePreprocessor.store_widget_state=True

.PHONY: docs
docs: docs-examples  ## mkdocs build
	mkdocs build --config-file $(CURDIR)/mkdocs.yml

.PHONY: netlify
netlify: assets  ## Build docs on Netlify
	pip uninstall -y jupyter-flex
	python setup.py install
	pip freeze
	python -c "import bokeh.sampledata; bokeh.sampledata.download()"
	pushd $(CURDIR)/docs && jupyter-nbconvert *.ipynb --to=notebook --inplace --execute --ExecutePreprocessor.store_widget_state=True && popd
	$(MAKE) docs

.PHONY: help
help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
