const Promise = require('bluebird')

module.exports = function (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const _args = [...args, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }]
      fn(..._args)
    })
  }
}
