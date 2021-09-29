# Releasing

## Upload to PyPI

- Update version on `__init__.py`
- Update version on `pyproject.toml`
- Update `CHANGELOG.md`
- Update `README.md` and docs
    - Links to Binder should use the new version

```shell
export VERSION=1.0.0

# Optional reset
make cleanall resetjs
make download-assets npm-install

# Build
make all
make upload-pypi

git commit -am "Release ${VERSION}" --allow-empty
git tag ${VERSION}

git push origin ${VERSION}
git push
```

### NPM release

```shell
export VERSION=1.0.0

cd js

npm version ${VERSION}
npm publish

git commit -am "NPM Release ${VERSION}" --allow-empty
git push
```
