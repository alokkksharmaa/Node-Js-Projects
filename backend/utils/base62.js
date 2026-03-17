const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

/**
 * Encodes an integer counter into a Base62 ShortCode
 * @param {number} num 
 * @returns {string} Base62 encoded string
 */
export function encode(num) {
  if (num === 0) return ALPHABET[0];
  let str = "";
  while (num > 0) {
    str = ALPHABET[num % BASE] + str;
    num = Math.floor(num / BASE);
  }
  return str;
}
