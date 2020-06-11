# How to release a new version

## Upload to test PyPI

```
export VERSION=1.0.0
git checkout -b release-${VERSION}

git commit -am "Release ${VERSION}.a0" --allow-empty
git tag ${VERSION}.a0

# Optional reset
make cleanall
make npm-install

# Build
make build

# Upload to test pypi
make upload-test

# Create venv and install alpha version
pip install --extra-index-url=https://test.pypi.org/simple 'jupyter-flex[test]'==${VERSION}a0

# Change to the examples directory and run voila, verify things look ok
voila --template flex --debug

# Delete alpha tag
git tag -d ${VERSION}.a0
```

Merge branch when CI passes

## Upload to PyPI

- Update `CHANGELOG.md`
- Update `README.md` and docs:
    -  Links to Binder

```
export VERSION=1.0.0

git commit -am "Release ${VERSION}" --allow-empty
git tag ${VERSION}

make cleanall
make build
make upload-pypi
git push origin ${VERSION}
git push
```
