module.exports = function (cb) {
  const eventList = ['uncaughtException', 'SIGINT', 'SIGTERM']

  eventList.forEach(event => {
    process.once(event, cb)
  })

  return function () {
    eventList.forEach(event => {
      process.removeListener(event, cb)
    })
  }
}
