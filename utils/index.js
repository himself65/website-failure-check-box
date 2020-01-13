const axios = require('axios')
const signale = require('signale')

exports.mustExist = (value, name = value) => {
  if (!value) {
    throw new TypeError(`Environment variable: '${name}' must be set.`)
  }
}

exports.checkWebsiteExist = async (site) => {
  if (typeof site !== 'string') {
    throw new TypeError('site name must be a string.')
  }
  let exist = false
  for (let i = 0; i < 3; i++) {
    // tip: check 3 times
    exist |= await axios.get(site).then(response => response.status !== 404)
      .catch(error => signale.error(error))
  }
  return exist
}
