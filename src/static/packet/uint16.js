/**
 * @file Encoding/decoding functions for uint16-packet
 *
 * More detail of packet protocol, see `designs/packet-protocol.md`
 *
 * @author aKuad
 */


/**
 * Packet ID of participant-count
 */
export const PACKET_ID_PARTICIPANT_COUNT = 0x21;

/**
 * Packet ID of survey-start
 */
export const PACKET_ID_SURVEY_START = 0x22;

/**
 * Packet ID of survey-result
 */
export const PACKET_ID_SURVEY_RESULT = 0x23;

/**
 * Array of all uint16 packet IDs
 */
const PACKET_IDS_UINT16 = [PACKET_ID_PARTICIPANT_COUNT,
                           PACKET_ID_SURVEY_START,
                           PACKET_ID_SURVEY_RESULT];


/**
 * Create uint16-packet
 *
 * @param {number} packet_id Packet ID to contain
 * @param {number} uint16_value Value to contain
 * @returns {ArrayBuffer} Encoded packet
 *
 * @throws {RangeError} When unknown packet_id passed
 */
export function encode_uint16_packet(packet_id, uint16_value) {
  if(!PACKET_IDS_UINT16.includes(packet_id)) {
    throw new RangeError(`Packet ID ${packet_id} is unknown`);
  }

  if(uint16_value < 0 || 0xffff < uint16_value) {
    throw new RangeError(`uint16_value must be in 0~65535, but got ${uint16_value}`);
  }

  return Uint8Array.of(packet_id, uint16_value & 0xff, (uint16_value >> 8) & 0xff).buffer;
}


/**
 * Data structure of uint16-packet data
 *
 * @typedef {Object} Uint16PacketData
 * @property {number} packet_id Packet ID
 * @property {number} uint16_value Uint16 value (for detail, see `designs/packet-protocol.md`)
 */

/**
 * Unpack uint16-packet
 *
 * @param {ArrayBuffer} packet Packet to decode
 * @returns {Uint16PacketData} Decoded packet data
 *
 * @throws {Error} When non uint16-packet array passed
 */
export function decode_uint16_packet(packet) {
  const packet_uint8 = new Uint8Array(packet);
  if(!is_uint16_packet(packet)) {
    throw new Error(`It is not a uint16-packet - got [${packet_uint8.toString()}]`);
  }
  return {packet_id: packet_uint8[0], uint16_value: packet_uint8[1] | (packet_uint8[2] << 8)};
}


/**
 * Verify the packet is uint16-packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` is uint16-packet: true, otherwise: false
 */
export function is_uint16_packet(packet) {
  if(packet.byteLength != 3) return false;

  const packet_id = new DataView(packet).getUint8(0);
  if(!PACKET_IDS_UINT16.includes(packet_id)) return false;

  return true;
}
