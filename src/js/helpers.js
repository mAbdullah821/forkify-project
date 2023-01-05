import { TIMEOUT_SEC, DECIMAL_NUMBER_COUNT } from './config.js';
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

// A helper function to calculate the greatest common divisor of two numbers
const getGCD = function (a, b) {
  if (b === 0) {
    return a;
  }
  return getGCD(b, a % b);
};

export const decimalToFraction = function (decimal) {
  // Convert the decimal to a string
  const decimalString = decimal.toFixed(DECIMAL_NUMBER_COUNT).toString();

  // Split the string at the decimal point
  const parts = decimalString.split('.');

  // Convert the integer part and the fraction part to numbers
  const integerPart = parseInt(parts[0]);
  const fractionPart = parseFloat('0.' + parts[1]);

  // Calculate the denominator by multiplying the fraction part by a power of 10
  let denominator = Math.pow(10, parts[1].length);

  // Calculate the numerator by adding the product of the fraction part and the denominator to the product of the integer part and the denominator
  let numerator = integerPart * denominator + fractionPart * denominator;

  // Simplify the fraction by dividing the numerator and the denominator by their greatest common divisor
  const gcd = getGCD(numerator, denominator);
  numerator /= gcd;
  denominator /= gcd;
  // Return the simplified fraction as a string
  if (denominator === 1) return `${numerator}`;
  if (numerator < denominator) return `${numerator}/${denominator}`;
  return `${Number.parseInt(numerator / denominator)} ${
    numerator % denominator
  }/${denominator}`;
};
