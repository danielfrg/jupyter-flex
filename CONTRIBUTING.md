# Contributing

If you find any issues please create a [Github Issue](https://github.com/danielfrg/jupyter-flex/issues)
with as much info as possible, the best way is a submit reproducible notebook and
some screenshots of the dashboard.

## Setup development environment

Dependencies:

- Node.js
- Python

### 1. Javascript

Install dependencies

```shell
make npm-install
```

### 2. Python:

Create Python env

```shell
make env
conda activate jupyter-flex
```

Install package for development

```shell
make develop
```

This generates symlinks to the `<env>/share/jupyter/` directory.

### 3. Download external assets and test data

```shell
make download-assets
make download-data
```

### Iteration cycle

With the environment ready we can have a nice iteration cycle between JS and Python:

1. Start webpack in watch mode, this will also place the bundle files in the
   nbconvert and voila static directories.

```shell
make npm-dev
```

2. Now you can just start Voila and iterate quickly on the JS or Python code. For example, to start the Voila in the examples directory:

```shell
make voila-examples
```

## Tests

A system based on docker is provided and it's the same the CI system runs.

1. Start Selenium locally `make selenium` or in Docker `make selenium-docker`

Install Selenium and the Chrome driver on mac:

```shell
brew install chromedriver
brew install selenium-server-standalone
brew install --cask google-chrome
```

2. Start voila server locally: `make voila-examples`
3. Run pytest locally against Selenium

```shell
# Run a group of tests
make pytest-{marker}

# Run all tests
make pytest-all

# Run a specific test
make pytest PYTEST_K=ipysheet
```

To generate/update the test baselines just run the tests

## Docs

```shell
make docs
make serve-docs
```
