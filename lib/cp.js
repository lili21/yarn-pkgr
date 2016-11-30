const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')

module.exports = function (src, dest) {
  return new Promise((resolve, reject) => {
    const reader = fs.createReadStream(src)
    const writer = fs.createWriteStream(path.join(dest, path.basename(src)))

    reader.on('error', reject)
    writer.on('error', reject)
    writer.on('finish', resolve)

    reader.pipe(writer)
  })
}
