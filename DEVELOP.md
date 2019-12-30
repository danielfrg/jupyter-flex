# Development

```
make env  # Uses conda
conda activate jupyter-flex
python setup.py develop
make assets  # Downloads 3rd party CSS/JS assets
```

Now you can use `nbconvert` or `voila` as in the docs and change the source to iterate.

## SCSS

Personally I use vscode and the `liveSassCompile` extension to iterate quickly.

There is also a `make sassc` that uses `libsass` but you have to run it for each change.

## Docs

```
make docs-examples
make serve-docs
```
