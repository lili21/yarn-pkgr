const spawn = require('child_process').spawn
const Promise = require('bluebird')

module.exports = function (to) {
  return new Promise((resolve, reject) => {
    const yarnInstall = spawn('yarn', { cwd: to, stdio: 'inherit' })
    yarnInstall.on('close', code => {
      code ? reject('Error running yarn: code') : resolve(true)
    })
  })
}
