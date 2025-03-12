/**
 * @file Encoding/decoding functions for boolean-packet
 *
 * More detail of packet protocol, see `designs/packet-protocol.md`
 *
 * @author aKuad
 */


/**
 * Packet ID of survey-control
 */
export const PACKET_ID_SURVEY_CONTROL = 0x11;

/**
 * Packet ID of survey-response
 */
export const PACKET_ID_SURVEY_RESPONSE = 0x12;

/**
 * Packet ID of moderator-status
 */
export const PACKET_ID_MODERATOR_STATUS = 0x13;

/**
 * Array of all boolean packet IDs
 */
const PACKET_IDS_BOOLEAN = [PACKET_ID_SURVEY_CONTROL,
                            PACKET_ID_SURVEY_RESPONSE,
                            PACKET_ID_MODERATOR_STATUS];


/**
 * Create boolean-packet
 *
 * @param {number} packet_id Packet ID to contain
 * @param {boolean} boolean_value Value to contain
 * @returns {ArrayBuffer} Encoded packet
 *
 * @throws {RangeError} When unknown packet_id passed
 */
export function encode_boolean_packet(packet_id, boolean_value) {
  if(!PACKET_IDS_BOOLEAN.includes(packet_id)) {
    throw new RangeError(`Packet ID ${packet_id} is unknown`);
  }

  return Uint8Array.of(packet_id, Number(boolean_value)).buffer;
}


/**
 * Data structure of boolean-packet data
 *
 * @typedef {Object} BooleanPacketData
 * @property {number} packet_id Packet ID
 * @property {boolean} boolean_value Boolean value (for detail, see `designs/packet-protocol.md`)
 */

/**
 * Unpack boolean-packet
 *
 * @param {ArrayBuffer} packet Packet to decode
 * @returns {BooleanPacketData} Decoded packet data
 *
 * @throws {Error} When non boolean-packet array passed
 */
export function decode_boolean_packet(packet) {
  const packet_uint8 = new Uint8Array(packet);
  if(!is_boolean_packet(packet)) {
    throw new Error(`It is not a boolean-packet - got [${packet_uint8.toString()}]`);
  }
  return {packet_id: packet_uint8[0], boolean_value: Boolean(packet_uint8[1])};
}


/**
 * Verify the packet is boolean-packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` is boolean-packet: true, otherwise: false
 */
export function is_boolean_packet(packet) {
  if(packet.byteLength != 2) return false;

  const packet_id = new DataView(packet).getUint8(0);
  if(!PACKET_IDS_BOOLEAN.includes(packet_id)) return false;

  return true;
}
