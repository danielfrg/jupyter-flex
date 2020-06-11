# How to release a new version

## Upload to test PyPI

```
export VERSION=1.0.0
git checkout -b release-${VERSION}

git commit -am "Release ${VERSION}.alpha0" --allow-empty
git tag ${VERSION}.alpha0

# Optional reset
make cleanall
make npm-install

# Build
make build

# Upload to test pypi
make upload-test

# Create venv and install alpha version
pip install --extra-index-url=https://test.pypi.org/simple 'jupyter-flex[test]'==${VERSION}alpha0

# Change to another directory and run tests
pytest --pyargs jupyter-flex

# Delete alpha tag
git tag -d ${VERSION}.alpha0
```

Merge branch when CI passes

## Upload to PyPI

-   Update `CHANGELOG.md`
-   Update `README.md` and docs as needed

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
