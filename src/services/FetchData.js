import 'isomorphic-fetch';

const apiUrl = 'https://private-bf7f31-hummingbirdsimple.apiary-mock.com';

const fetchApi = (endPoint, payload = {}, method = 'get', headers = {}) => {
  const request = {
    method,
    headers,
    ...(method !== 'get') ? {
      body: JSON.stringify(payload)
    } : {}
  };

  const requestUrl = `${apiUrl}${endPoint}`;

  return fetch(requestUrl, request)
    .then(response => (
      response.json()
        .then(json => ({ json, response }))
        .catch(() => ({ json: {}, response }))
    ))
    .then(({ json, response }) => {
      if (response.ok === false) {
        throw json;
      }
      return json;
    })
    .catch((e) => {
      if (e.response && e.response.json) {
        return e.response.json().then((json) => {
          if (json) throw json;
          throw e;
        });
      }
      throw e;
    });
};


const FetchCrops = () => fetchApi('/crops');

export const FetchData = () => fetchApi('/farm');
