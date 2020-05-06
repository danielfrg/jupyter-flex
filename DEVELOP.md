# Development

```
# Create conda env
make env
conda activate jupyter-flex

# Downloads 3rd party CSS/JS assets
make assets

# Install package
make develop
```

Now you can use `nbconvert` or `voila` as in the docs and change the source to iterate.

## `.scss`

If you are changing the styles, probably the easiest way is to configure it on your favourite editor.

There is a `make sassc` that uses `libsass` but you have to run it for each change.

## Testing

1. `make selenium`: Start Selenium in docker-compose
2. `make serve-examples`: Start voila server locally
3. `make test`: Run pytest locally agains Selenium

## Docs

```
make docs-examples
make serve-docs
```
