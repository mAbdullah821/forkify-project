import { TIMEOUT_SEC } from './config.js';
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const callAJAX = async function (url, options = {}) {
  try {
    const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} failed with status code ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
