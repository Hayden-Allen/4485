export default async function fetchJson(url, options) {
  if (typeof options.query === 'object') {
    const queryParams = new URLSearchParams(options.query)
    console.log(queryParams)
    url = `${url}?${queryParams.toString()}`
    delete options.query
  }

  if (typeof options.body === 'object') {
    options.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, options)

  if (response.ok) {
    const json = await response.json()
    console.log("checking response status")
    return json
  }

  throw new Error(response.statusText)
}

export async function fetchGames(url) {
  const response = await fetch(url)

  if (response.ok) {
    const json = await response.json()
    console.log("Game return success")
    return json
  }

  throw new Error(response.statusText)
}
