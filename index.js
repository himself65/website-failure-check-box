if (!process.env.CI) {
  // dont load .env file on CI mode
  require('dotenv').config()
}
const signale = require('signale')
const moment = require('moment')
const { mustExist, checkWebsiteExist } = require('./utils')
const Octokit = require('@octokit/rest')

const {
  GIST_ID: gistID,
  GH_TOKEN: githubToken,
  LISTENED_WEBSITES: targets
} = process.env

const octokit = new Octokit({ auth: `token ${githubToken}` })

;[
  [gistID, 'GIST_ID'],
  [githubToken, 'GH_TOKEN'],
  [targets, 'LISTEN_WEBSITE']
].forEach(([v, n]) => mustExist(v, n))

;(async () => {
  signale.pending('Fetching gists...')
  const gist = await octokit.gists.get({ gist_id: gistID })
    .catch(error => { throw new Error(`Unable to get gist\n${error}`) })
  const sites = targets.split(',')
  const lines = []
  for (const key in sites) {
    const site = sites[key]
    signale.watch(`Checking site: ${site}...`)
    const exist = await checkWebsiteExist(site)
    if (exist) {
      lines.push(`${site} haven't shut down now...`)
    } else {
      lines.push(`${site} have shut down!!!`)
    }
  }
  lines.push(`Update at ${moment().format('dddd, MMMM Do YYYY, k:mm:ss Z')}`)
  if (process.env.CI) {
    signale.complete('Done on CI.')
    process.exit(0)
  }
  try {
    const fileName = Object.keys(gist.data.files)[0]
    signale.pending('Upload new gist content...')
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
  } finally {
    signale.success('Done!')
  }
})()
