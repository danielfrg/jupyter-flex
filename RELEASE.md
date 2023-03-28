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
task resetjs
task download-assets js-install

# Clean and install JS
task cleanall
task js-build

# Build Python and publish
task build
hatch publish

git commit -am "Release ${VERSION}" --allow-empty
git tag ${VERSION}

git push origin ${VERSION}
git push
```

### NPM release

- Update version in `package.json`

```shell
export VERSION=1.0.0

cd js

npm version ${VERSION}
npm publish

git commit -am "NPM Release ${VERSION}" --allow-empty
git push
```
