import config from './config';

async function serverRequest (url, method, data, options) {
  let auth;
  if (options) {
    auth = options.token ? `Bearer ${options.token}` : undefined;
  }
  const response = await fetch(config.BASE_URL + url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    data: method === 'GET' ? undefined : JSON.stringify(data),
  });
  if (!response.ok) {
    return response.text().then(message => { throw new Error(JSON.parse(message).message) })
  } else {
    return response.json();
  }
}

export default serverRequest;
