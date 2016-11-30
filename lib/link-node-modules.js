const path = require('path')
const Promise = require('bluebird')
const rimraf = Promise.promisify(require('rimraf'))
const symlink = Promise.promisify(require('fs').symlink)

module.exports = function (src, dest) {
  const _src = path.join(src, 'node_modules')
  const _dest = path.join(dest, 'node_modules')
  return rimraf(_dest).then(() => {
    return symlink(_src, _dest, 'dir')
  })
}
