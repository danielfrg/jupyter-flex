# How to Contribute

If you find any issues please create [Github Issue](https://github.com/danielfrg/jupyter-flex/issues)
with as much info as possible, the best way is a submit reproducible notebook and
some screenshots.

# Development environment

If you are interested in submiting a PR with new features or fixing bugs
here are some instructions to setup the dev environment.

Dependencies are:
- npm
- python

### 1. Download third-party CSS/JS assets (bootstrap and others):

```
make download-assets
```

### 2. Javascript

Install dependecies:

```
make npm-install
```

### 3. Python:

Create conda env (or use the requirements.txt file if you want to use virtualenv)

```
make env
conda activate jupyter-flex
```

Install the package on dev mode

```
make develop
```

## Iteration cycle

To have a nice iteracion cycle between JS and Python:

1. Terminal 1: Start webpack in watch mode, this will also place the bundle files in the
nbconvert and voila static directories.

```
make npm-dev
```

2. Terminal 2: Now you can just start voila and iterate quickly on the JS or Python code.
To start the voila in the examples directory:

```
make voila-examples
```

## Testing

The CI system runs this but in case you want to do it locally to debug CI issues:

1. `make selenium`: Start Selenium in docker-compose
2. `make voila-examples`: Start voila server locally
3. `make test`: Run pytest locally against Selenium
4. `make test-baselines PYTEST_K=ipysheet`: To run just one test

To generate/update baselines:

```
make test-baselines
```

## Docs

```
make docs-examples
make serve-docs
```
