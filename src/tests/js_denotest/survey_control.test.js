/**
 * @file Tests for `packet/survey_control.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test`
 *
 * @author aKuad
 */

import { assertEquals, assertThrows } from "jsr:@std/assert@1";

import { encode_survey_control_packet, decode_survey_control_packet, is_survey_control_packet } from "../../static/packet/survey_control.js";


Deno.test(async function true_cases(t) {
  /**
   * - Can encode/decode survey-control-packet
   *   - Original data and decoded data must be equal
   * - Can verify the packet is valid as survey-control-packet
   */
  await t.step(function encode_verify_decode() {
    const value_org = true;
    const packet = encode_survey_control_packet(value_org);
    const value_res = decode_survey_control_packet(packet);

    assertEquals(value_res, value_org);
    assertEquals(is_survey_control_packet(packet), true);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can detect non survey-control-packet
   *   - When length is not 2 bytes
   *   - When packet type ID is mismatch
   */
  await t.step(function decode_invalid_packet() {
    const packet_too_short   = Uint8Array.of(0x10);
    const packet_too_long    = Uint8Array.of(0x10, 0x00, 0x01); // 0x01 as extra byte
    const packet_invalid_id  = Uint8Array.of(0x90, 0x00);       // 0x90 as non 0x10 value

    assertThrows(() => decode_survey_control_packet(packet_too_short) , Error, "It is not a survey-control-packet - got [16]");
    assertThrows(() => decode_survey_control_packet(packet_too_long ) , Error, "It is not a survey-control-packet - got [16,0,1]");
    assertThrows(() => decode_survey_control_packet(packet_invalid_id), Error, "It is not a survey-control-packet - got [144,0]");
  });
});
