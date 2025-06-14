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

    assertEquals(is_only_num_alp(numbers          ), 0);
    assertEquals(is_only_num_alp(upper_alphabets  ), 0);
    assertEquals(is_only_num_alp(lower_alphabets  ), 0);
    assertEquals(is_only_num_alp(numbers_alphabets), 0);
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

    assertEquals(is_only_num_alp(non_ascii), 1);
    assertEquals(is_only_num_alp(ascii_space), 2);
    assertEquals(is_only_num_alp(ascii_symbol), 3);
  });
});
