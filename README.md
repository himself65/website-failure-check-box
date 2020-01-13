# Website Failure Check Box

> 网站关闭检查器

## Setup

### Prep work

1. Create a new public GitHub Gist (https://gist.github.com/)
2. Create a token with the `gist` scope and copy it. (https://github.com/settings/tokens/new)

### Project setup

1. Fork this repo
2. Edit the 
[environment variable](https://github.com/Himself65/website-failure-check-box/blob/master/github/workflows/checker.yml#L29-L32)
in `.github/workflows/checker.yml`:
    - **GIST_ID**: The ID portion from your gist url: `https://gist.github.com/himself65/`**`68d7d8edbb14a8769d8021cc9513ba80`**.
    - **LISTENED_WEBSITES**: The website you want to monitor.

3. Go to the repo **Settings > Secrets**
4. Add the following environment variables:
   - **GH_TOKEN**: The GitHub token generated above.
