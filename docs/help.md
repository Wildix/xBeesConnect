# xBeesConnect  js  library

Create a Git Tag with the Package Version:

Use the following commands to create a Git tag using the version from your package.json:

### Development
For development purposes use **_beta_** tag versioning
#### Create a Git tag using the version
```
yarn version --preid beta --prerelease
```
#### all in one
```
yarn version --preid beta --prerelease && git push origin && git push origin --tags
```


### Release
#### Create a Git tag using the version
```
yarn release:patch
```
#### all in one
```
yarn release:patch && git push origin && git push origin --tags
```

### Push

#### Push commits to the remote repository
```
git push origin
```
#### Push the newly created tag to the remote repository
```
git push origin --tags
```
#### check remote tags
```
git ls-remote --tags 
```

#### remove tags
```
git tag -d <tag> 
git push origin --delete <tag> 
```


