# Contributing

If you find any issues please create a
[Github Issue](https://github.com/danielfrg/jupyter-flex/issues)
with as much info as possible, the best way is a submit reproducible notebook
and some screenshots of the dashboard.

## Setup development environment

Dependencies:

- Node.js
- Python

### 1. Javascript

Install dependencies

```shell
cd js
npm install
```

### 2. Python

Create Python env

```shell
cd python

hatch env create
hatch shell
```

### 3. Download external assets and test data

```shell
task download-assets download-testdata
```

### Iteration cycle

With both environments ready we can have a nice iteration cycle between JS and Python:

1. Start webpack in watch mode, this will also place the bundle files in the
   nbconvert and voila static directories.

```shell
cd js
npm run dev
```

2. Now you can just start Voila and iterate quickly on the JS or Python code. For example, to start the Voila in the examples directory:

```shell
task voila-examples
```

## Tests

A system based on docker is provided and it's the same the CI system runs.

1. Start Selenium locally `task selenium-server` or in Docker `task selenium-docker`
2. Start voila server locally: `make voila-examples`
3. Run pytest locally against Selenium

```shell
# Run a group of tests
PYTEST_M=layouts task pytest

# Run a specific test
PYTEST_K=ipysheet task pytest

# Run all tests
task pytest-all
```

To generate/update the test baselines just run the tests

### Install Selenium and the Chrome driver on mac

```shell
brew install chromedriver
brew install selenium-server-standalone
brew install --cask google-chrome
```

## Docs

```shell
make docs
make serve-docs
```
