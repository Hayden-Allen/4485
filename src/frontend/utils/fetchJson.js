export default async function fetchJson(url, options) {
  if (typeof options.query === 'object') {
    const queryParams = new URLSearchParams(options.query)
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
    return json
  }

  throw new Error(response.statusText)
}
