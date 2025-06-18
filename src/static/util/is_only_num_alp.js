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
 * Check passed string is including only numbers and/or alphabets (uppercase and lowercase)
 *
 * Note: When `str` has multiple incorrect reason, first detected reason will be returned
 *
 * @param {string} str String to check
 * @returns {number} Check result ... 0: Correct, 1: Non-ascii character including, 2: Ascii space including, 3: Ascii symbol including
 */
export function is_only_num_alp(str) {
  for(let c = 0; c < str.length; c++) {
    // Lint ignore - Control regex is OK for ascii (including control characters) or non-ascii checking
    // deno-lint-ignore no-control-regex
    if(!(/[\x00-\x7F]/.test(str[c])))
      return 1;

    if(str[c] === " ")
      return 2;

    if(!(allowed_chars.includes(str[c])))
      return 3;
  };

  return 0;
}
