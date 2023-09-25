# xBeesConnect  js  library

Create a Git Tag with the Package Version:

Use the following commands to create a Git tag using the version from your package.json:

#### Get the current version from package.json
```
VERSION=$(node -p "require('./package.json').version")
```
#### Create a Git tag using the version
```
git tag -a v"$VERSION" -m "Version v$VERSION"
```
#### Push the newly created tag to the remote repository
```
git push origin
```
