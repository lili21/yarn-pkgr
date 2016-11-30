const Promise = require('bluebird')
const exec = require('child_process').exec

module.exports = function (next) {
  return new Promise((resolve, reject) => {
    exec('yarn --version', (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}
