yarn-pkgr
==========
> inspired by [npm-pkgr](https://github.com/vvo/npm-pkgr)

Just like [npm-pkgr](https://github.com/vvo/npm-pkgr), but for [yarn](https://yarnpkg.com/)

`yarn-pkgr` caches `yarn install` results.
If your package.json did not change from last build, then you will immediately get a symlink `node_modules`.

Usage
-----

```
$ npm install -g yarn-pkgr
$ yarn-pkgr
```

Todo List
---------

* remove outdated cache
* accept args
