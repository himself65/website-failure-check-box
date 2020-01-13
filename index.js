require('dotenv').config()
const moment = require('moment')
const { mustExist, checkWebsiteExist } = require('./utils')
const Octokit = require('@octokit/rest')

const {
  GIST_ID: gistID,
  GH_TOKEN: githubToken,
  LISTEN_WEBSITES: targets
} = process.env;

[
  [gistID, 'GIST_ID'],
  [githubToken, 'GH_TOKEN'],
  [targets, 'LISTEN_WEBSITE']
].forEach(([v, n]) => mustExist(v, n))

const octokit = new Octokit({ auth: `token ${githubToken}` })

;(async () => {
  const gist = await octokit.gists.get({ gist_id: gistID })
    .catch(error => { throw new Error(`Unable to get gist\n${error}`) })
  const sites = targets.split(',')
  const lines = []
  for (const site in sites) {
    const exist = await checkWebsiteExist(site)
    if (exist) {
      lines.push(`${site} haven't shut down now...`)
    } else {
      lines.push(`${site} have shut down!!!`)
    }
  }
  lines.push(`Update at ${moment().format('dddd, MMMM Do YYYY, k:mm:ss Z')}`)
  try {
    const fileName = Object.keys(gist.data.files)[0]
    await octokit.gists.update({
      gist_id: gistID,
      files: {
        [fileName]: {
          fileName: 'Did following site(s) shut down?',
          content: lines.join('\n')
        }
      }
    })
  } catch (error) {
    throw Error('Cannot update gist')
  }
})()
