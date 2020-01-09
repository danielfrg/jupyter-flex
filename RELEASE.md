## How to releae a new version

- Update `CHANGELOG.md`
- Update version `environment.yml`
- Update version tag links that go to binder.org on `README.md` and docs

```
export VERSION=1.0.0
git commit -am "Release ${VERSION}" --allow-empty
git tag -a ${VERSION} -m "${VERSION}"
git push origin ${VERSION}
git push
```

```
make clean
make build
make upload-pypi

# Or to upload to test-pypi
make upload-test
```
