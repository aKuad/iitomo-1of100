/**
 * @file Random ascii string generator
 *
 * @author aKuad
 */


/**
 * Return random ascii string
 *
 * The string includes numbers, uppercase and lowercase alphabets.
 * Control ascii, symbol ascii and UTF chars (emoji and so on) are excluded.
 *
 * @param {number} length Length of generated string
 * @returns {string} Generated random string
 * @throws {RangeError} If `length` is negative value
 */
export function random_str_gen(length) {
  // Argument check
  if(length < 0) {
    throw new RangeError(`\`length\` must be 0 or positive value, but got ${length}`);
  }

  // Allowed chars table definition
  const allowed_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // String generation
  const str_buf = new Uint8Array(length);
  for(let i = 0; i < str_buf.length; i++) {
    const pick_char_index = Math.floor(Math.random() * allowed_chars.length);
    str_buf[i] = allowed_chars.charCodeAt(pick_char_index);
  }

  const text_decoder = new TextDecoder();
  return text_decoder.decode(str_buf.buffer);
}
