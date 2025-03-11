/**
 * @file Tests for `packet/boolean.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test`
 *
 * @author aKuad
 */

import { assertEquals, assertThrows } from "jsr:@std/assert@1";

import { encode_boolean_packet, decode_boolean_packet, is_boolean_packet, PACKET_ID_SURVEY_CONTROL } from "../../static/packet/boolean.js";


Deno.test(async function true_cases(t) {
  /**
   * - Can encode/decode boolean-packet
   *   - Original data and decoded data must be equal
   * - Can verify the packet is valid as boolean-packet
   */
  await t.step(function encode_verify_decode() {
    const packet_id_org              = PACKET_ID_SURVEY_CONTROL;
    const boolean_value_org          = true;
    const packet                     = encode_boolean_packet(packet_id_org, boolean_value_org);
    const {packet_id, boolean_value} = decode_boolean_packet(packet);

    assertEquals(is_boolean_packet(packet), true);
    assertEquals(packet_id, packet_id_org)
    assertEquals(boolean_value, boolean_value_org);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can detect unknown packet ID specified for encode
   */
  await t.step(function encode_invalid_packet_id() {
    assertThrows(() => encode_boolean_packet(0x90, true), RangeError, "Packet ID 144 is unknown");
    // 0x90 as non 0x1X value
  });


  /**
   * - Can detect non boolean-packet
   *   - When length is not 2 bytes
   *   - When packet type ID is mismatch
   */
  await t.step(function decode_invalid_packet() {
    const packet_too_short  = Uint8Array.of(0x11).buffer;
    const packet_too_long   = Uint8Array.of(0x11, 0x00, 0x01).buffer;  // 0x01 as extra byte
    const packet_invalid_id = Uint8Array.of(0x90, 0x00).buffer;        // 0x90 as non 0x1X value

    assertThrows(() => decode_boolean_packet(packet_too_short) , Error, "It is not a boolean-packet - got [17]");
    assertThrows(() => decode_boolean_packet(packet_too_long ) , Error, "It is not a boolean-packet - got [17,0,1]");
    assertThrows(() => decode_boolean_packet(packet_invalid_id), Error, "It is not a boolean-packet - got [144,0]");
  });


  /*
   * For `is_boolean_packet` test is done by `decode_invalid_packet`
   */
});
