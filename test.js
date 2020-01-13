/* eslint-env node, jest */
const { exec } = require('child_process')
jest.setTimeout(10000)

const {
  GH_TOKEN,
  GIST_ID
} = process.env

describe('should throw error on incorrectly env', () => {
  it('on empty env', done => {
    exec('node ./index.js', {
      cwd: process.cwd(),
      env: { CI: true } // empty
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
          [value]: 'foo',
          CI: true
        }
      }, (error) => {
        expect(/throw new TypeError/.test(error)).toBeTruthy()
        if (index === array.length - 1) {
          done()
        }
      }))
  })
})
