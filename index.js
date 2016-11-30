#!/usr/bin/env node
const path = require('path')
const Promise = require('bluebird')

const computeHash = require('./lib/compute-hash')
const cp = require('./lib/cp')
const yarnInstall = require('./lib/yarn-install')
const linkNodeModules = require('./lib/link-node-modules')

const mkdirp = Promise.promisify(require('mkdirp'))
const access = Promise.promisify(require('fs').access)

const cwd = process.cwd()
const yarnPkgrCache = path.join(process.env.HOME, '.yarn-pkgr')

var cachedir

mkdirp(yarnPkgrCache)
.then(() => {
  return computeHash(cwd)
})
.then(hash => {
  cachedir = path.join(yarnPkgrCache, hash)
  return mkdirp(cachedir)
})
.then(dir => {
  if (dir === null) {
    return false
  }

  const files = ['.yarnrc', 'yarn.lock', 'package.json'].map(name => path.join(cwd, name))
  return Promise.resolve(files)
    .filter(file => {
      return access(file)
        .then(() => true)
        .catch(() => false)
    })
    .then(files => {
      return Promise.all(files.map(file => cp(file, dir)))
    })
    .then(() => {
      return yarnInstall(dir)
    })
})
.then(yarnUsed => {
  return linkNodeModules(cachedir, cwd).then(() => {
    console.log('Packages installed')
    if (!yarnUsed) {
      console.log('using cache')
    }
  })
})
.catch(e => {
  console.error(e)
  console.log()
  console.error('An error occured while `yarn-pkgr` ran')
})

