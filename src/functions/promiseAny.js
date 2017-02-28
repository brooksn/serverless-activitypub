'use strict'
module.exports = function promiseAny(promises) {
  const P = new Promise((resolve, reject) => {
    const numberOfPromises = promises.length
    const resolutions = []
    const rejections = []
    let numberOfCompletions = 0

    promises.forEach(p => {
      p.then(ok => {
        resolutions.push(ok)
        numberOfCompletions += 1
        if (numberOfCompletions >= numberOfPromises) {
          if (resolutions.length > 0) return resolve(resolutions)
          else return reject(rejections)
        }
      })
      .catch(err => {
        rejections.push('err')
        numberOfCompletions += 1
        if (numberOfCompletions >= numberOfPromises) {
          if (resolutions.length > 0) return resolve(resolutions)
          else return reject(rejections)
        }
      })
    })
  })
  return P
}
