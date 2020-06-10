# Development

Setting up development for quick iteration

Deps:

```
# Download third-party CSS/JS assets
make download-assets
```

Python:

```
# Create conda env
make env
conda activate jupyter-flex

# Install package
make develop
```

JS/React:

```
# Install deps
make npm-install
```

## Iteration cycle

Start webpack in watch mode, this will also place the build files in the voila
static directory.

```
make npm-dev
```

Now you can just start voila and iterate quickly on the JS or Python code.
To start the voila in the examples directory:

```
make voila-examples
```

## Testing

1. `make selenium`: Start Selenium in docker-compose
2. `make voila-examples`: Start voila server locally
3. `make test`: Run pytest locally agains Selenium

## Docs

```
make docs-examples
make serve-docs
```
