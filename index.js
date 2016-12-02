#!/usr/bin/env node
const path = require('path')
const Promise = require('bluebird')

const computeHash = require('./lib/compute-hash')
const cp = require('./lib/cp')
const yarnInstall = require('./lib/yarn-install')
const linkNodeModules = require('./lib/link-node-modules')

const lockfile = require('lockfile')
const lock = Promise.promisify(lockfile.lock, { context: lockfile })
const unlock = Promise.promisify(lockfile.unlock, { context: lockfile })
const mkdirp = Promise.promisify(require('mkdirp'))
const access = Promise.promisify(require('fs').access)

const cwd = process.cwd()
const yarnPkgrCache = path.join(process.env.HOME, '.yarn-pkgr')

var cachedir
var cachelock

mkdirp(yarnPkgrCache)
.then(() => {
  return computeHash(cwd)
})
.then(hash => {
  cachedir = path.join(yarnPkgrCache, hash)
  cachelock = path.join(yarnPkgrCache, hash + '.lock')
  // return mkdirp(cachedir)
  return Promise
    .all([
      lock(cachelock, {
        wati: 2 * 1000,
        stale: 60 * 1000,
        retries: 30
      }),
      mkdirp(cachedir)
    ])
    .then(results => results[1])
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
  unlock(cachelock)
  return linkNodeModules(cachedir, cwd).then(() => {
    console.log('Packages installed')
    if (!yarnUsed) {
      console.log('using cache')
    }
  })
})
.catch(e => {
  unlock(cachelock)
  require('rimraf').sync(cachedir)
  console.error(e)
  console.log()
  console.error('An error occured while `yarn-pkgr` ran')
})

