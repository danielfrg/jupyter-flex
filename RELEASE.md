## How to releae a new version

- Update `CHANGELOG.md`
- Update links that go to binder.org to use the new tag in README.md and docs

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
