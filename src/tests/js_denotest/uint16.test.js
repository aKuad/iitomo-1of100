/**
 * @file Tests for `packet/uint16.js` module
 *
 * About test cases, see each test step function comment
 *
 * Test steps:
 *   * Run this script by deno test - `deno test`
 *
 * @author aKuad
 */

import { assertEquals, assertThrows } from "jsr:@std/assert@1";

import { encode_uint16_packet, decode_uint16_packet, is_uint16_packet, PACKET_ID_PARTICIPANT_COUNT } from "../../static/packet/uint16.js";


Deno.test(async function true_cases(t) {
  /**
   * - Can encode/decode uint16-packet
   *   - Original data and decoded data must be equal
   * - Can verify the packet is valid as uint16-packet
   */
  await t.step(function encode_verify_decode() {
    const packet_id_org             = PACKET_ID_PARTICIPANT_COUNT;
    const uint16_value_org          = 10;
    const packet                    = encode_uint16_packet(packet_id_org, uint16_value_org);
    const {packet_id, uint16_value} = decode_uint16_packet(packet);

    assertEquals(is_uint16_packet(packet), true);
    assertEquals(packet_id, packet_id_org)
    assertEquals(uint16_value, uint16_value_org);
  });
});


Deno.test(async function err_cases(t) {
  /**
   * - Can detect unknown packet ID specified for encode
   */
  await t.step(function encode_invalid_packet_id() {
    assertThrows(() => encode_uint16_packet(0x90, true), RangeError, "Packet ID 144 is unknown");
    // 0x90 as non 0x1X value
  });


  /**
   * - `uint16_value` must be in 0~65535 (0x0~0xffff)
   */
  await t.step(function encode_invalid_packet_id() {
    assertThrows(() => encode_uint16_packet(PACKET_ID_PARTICIPANT_COUNT, -1)     , RangeError, "uint16_value must be in 0~65535, but got -1");
    assertThrows(() => encode_uint16_packet(PACKET_ID_PARTICIPANT_COUNT, 0x10000), RangeError, "uint16_value must be in 0~65535, but got 65536");
  });


  /**
   * - Can detect non uint16-packet
   *   - When length is not 2 bytes
   *   - When packet type ID is mismatch
   */
  await t.step(function decode_invalid_packet() {
    const packet_too_short  = Uint8Array.of(0x21, 0x00).buffer;
    const packet_too_long   = Uint8Array.of(0x21, 0x00, 0x00, 0x01).buffer;  // 0x01 as extra byte
    const packet_invalid_id = Uint8Array.of(0x90, 0x00, 0x00).buffer;        // 0x90 as non 0x1X value

    assertThrows(() => decode_uint16_packet(packet_too_short) , Error, "It is not a uint16-packet - got [33,0]");
    assertThrows(() => decode_uint16_packet(packet_too_long ) , Error, "It is not a uint16-packet - got [33,0,0,1]");
    assertThrows(() => decode_uint16_packet(packet_invalid_id), Error, "It is not a uint16-packet - got [144,0,0]");
  });


  /*
   * For `is_uint16_packet` test is done by `decode_invalid_packet`
   */
});
