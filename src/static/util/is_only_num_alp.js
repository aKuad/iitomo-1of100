/**
 * @file String checker of including numbers or alphabets
 *
 * @author aKuad
 */


/**
 * Table of number and alphabet characters definition
 *
 * @type {string}
 */
const allowed_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";


/**
 * Return data structure of `is_only_num_alp()`
 *
 * @typedef {Object} CheckResult
 * @property {boolean} is_correct Including only numbers and/or alphabets: true, otherwise: false
 * @property {string} incorrect_reason Reason of `is_correct == false` (when `is_correct == true`, it will be empty string)
 */

/**
 * Check passed string is including only numbers and/or alphabets (uppercase and lowercase)
 *
 * @param {string} str String to check
 * @returns {CheckResult}
 */
export function is_only_num_alp(str) {
  for(let c = 0; c < str.length; c++) {
    if(!(/[\x00-\x7F]/.test(str[c])))
      return { is_correct: false, incorrect_reason: "Non-ascii character including" };

    if(str[c] === " ")
      return { is_correct: false, incorrect_reason: "Ascii space including" };

    if(!(allowed_chars.includes(str[c])))
      return { is_correct: false, incorrect_reason: "Ascii symbol including" };
  };

  return { is_correct: true, incorrect_reason: ""}
}
