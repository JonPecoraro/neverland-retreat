import http from "http";
import https from "https";

function doRequest(url) {
  return new Promise((resolve, reject) => {
    let req = null;
    if (url.indexOf('https://') > -1) {
      req = https.get(url);
    } else {
      req = http.get(url);
    }

    req.on('response', res => {
      resolve(res);
    });

    req.on('error', err => {
      reject(err);
    });
  });
}

export default async function httpGet(url, callback) {
  let returnValue = '';
  const response = await doRequest(url);
  const { statusCode } = response;

  if (statusCode !== 200) {
    throw new Error('Request Failed. Status code: ' + statusCode);
  }

  response.setEncoding('utf8');

  return new Promise((resolve) => {
    response.on('data', (chunk) => { returnValue += chunk; });
    response.on('end', () => {
      resolve(returnValue);
    });
  });
}
