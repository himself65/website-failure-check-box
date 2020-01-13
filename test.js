/* eslint-env node, jest */
const { exec } = require('child_process')

describe('should throw error on incorrectly env', () => {
  it('on empty env', done => {
    exec('node ./index.js', {
      cwd: process.cwd(),
      env: {} // empty
    }, (error) => {
      expect(/throw new TypeError/.test(error)).toBeTruthy()
      done()
    })
  })

  it('on incomplete env', done => {
    ['GIST_ID', 'GH_TOKEN', 'LISTEN_WEBSITES'].forEach(
      (value, index, array) => exec('node ./index.js', {
        cwd: process.cwd(),
        env: {
          [value]: 'foo'
        }
      }, (error) => {
        expect(/throw new TypeError/.test(error)).toBeTruthy()
        if (index === array.length - 1) {
          done()
        }
      }))
  })
})
