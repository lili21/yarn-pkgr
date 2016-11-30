const crypto = require('crypto')
const path = require('path')

const yarnVersion = require('./yarn-version')

module.exports = function (dir) {
  const hash = crypto.createHash('sha1')
  const json = require(path.join(dir, 'package.json'))
  return yarnVersion().then(version => {
    hash.update(process.version)
    hash.update(version)
    hash.update(JSON.stringify(json.dependencies))
    hash.update(JSON.stringify(json.devDependencies))
    return hash.digest('hex')
  })
}
