# Contributing

If you find any issues please create a [Github Issue](https://github.com/danielfrg/jupyter-flex/issues)
with as much info as possible, the best way is a submit reproducible notebook and
some screenshots.

## Development environment

If you are interested in submitting a PR with new features or fixing bugs
here are some instructions to setup the dev environment.

Dependencies are:

-   Node.js
-   Python

### 1. Download third-party CSS/JS assets (bootstrap and others):

```
make download-assets
```

### 2. Javascript

Install dependencies

```
make npm-install
```

### 3. Python:

Create Python env

```
make env
conda activate jupyter-flex
```

Install package for development

```
make develop
```

### Iteration cycle

To have a nice iteration cycle between JS and Python:

1. Terminal 1: Start webpack in watch mode, this will also place the bundle files in the
   nbconvert and voila static directories.

```
make npm-dev
```

2. Terminal 2: Now you can just start Voila and iterate quickly on the JS or Python code. For example, to start the Voila in the examples directory:

```
make voila-examples
```

## Tests

A system based on docker is provided and it's
the same the CI system runs.

1. Terminal 1: Start Selenium in docker-compose: `make selenium`
2. Terminal 2: Start voila server locally: `make voila-examples`
3. Terminal 3: Run pytest locally against Selenium

```
# Run all tests
make test

# Run a specific test
make test PYTEST_K=ipysheet
```

To generate/update the test baselines

```
make test-baselines
```

## Docs

```
make docs
make serve-docs
```
