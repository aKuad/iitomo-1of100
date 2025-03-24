/**
 * @file Tests for `util/is_only_num_alp.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test`
 *
 * @author aKuad
 */

import { assertEquals } from "jsr:@std/assert@1";

import { is_only_num_alp } from "../../static/util/is_only_num_alp.js";


Deno.test(async function true_cases(t) {
  /**
   * - Can pass number character as correct
   * - Can pass uppercase alphabet character as correct
   * - Can pass lowercase alphabet character as correct
   */
  await t.step(function correct_string() {
    const numbers           = "09";
    const upper_alphabets   = "AZ";
    const lower_alphabets   = "az";
    const numbers_alphabets = "09azAZ";

    assertEquals(is_only_num_alp(numbers          ).is_correct, true);
    assertEquals(is_only_num_alp(upper_alphabets  ).is_correct, true);
    assertEquals(is_only_num_alp(lower_alphabets  ).is_correct, true);
    assertEquals(is_only_num_alp(numbers_alphabets).is_correct, true);
  });


  /**
   * - Can detect non-ascii character as incorrect with reason message
   * - Can detect ascii space character as incorrect with reason message
   * - Can detect ascii symbol character as incorrect with reason message
   */
  await t.step(function invalid_string() {
    const non_ascii    = "🗒";
    const ascii_space  = " ";
    const ascii_symbol = "%";

    const non_ascii_res    = is_only_num_alp(non_ascii);
    const ascii_space_res  = is_only_num_alp(ascii_space);
    const ascii_symbol_res = is_only_num_alp(ascii_symbol);

    console.log(non_ascii_res);
    console.log(ascii_space_res);
    console.log(ascii_symbol_res);

    assertEquals(non_ascii_res.is_correct   , false);
    assertEquals(ascii_space_res.is_correct , false);
    assertEquals(ascii_symbol_res.is_correct, false);
    assertEquals(non_ascii_res.incorrect_reason   , "Non-ascii character including");
    assertEquals(ascii_space_res.incorrect_reason , "Ascii space including");
    assertEquals(ascii_symbol_res.incorrect_reason, "Ascii symbol including");
  });
});
