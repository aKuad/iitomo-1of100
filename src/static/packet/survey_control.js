/**
 * @file Encoding/decoding functions for survey-control-packet
 *
 * More detail of packet protocol, see `designs/packet-protocol.md`
 *
 * @author aKuad
 */


/**
 * Packet type ID of survey-control-packet
 */
const SURVEY_CONTROL_PACKET_ID = 0x10;


/**
 * Create survey-control-packet
 *
 * @param {boolean} is_survey_active Value of is_survey_active
 * @returns {ArrayBuffer} Encoded packet
 */
export function encode_survey_control_packet(is_survey_active) {
  return Uint8Array.of(SURVEY_CONTROL_PACKET_ID, Number(is_survey_active)).buffer;
}


/**
 * Unpack survey-control-packet
 *
 * @param {ArrayBuffer} packet Packet to decode
 * @returns {boolean} Value of is_survey_active
 */
export function decode_survey_control_packet(packet) {
  if(!is_survey_control_packet(packet)) {
    const packet_str = new Uint8Array(packet).toString();
    throw new Error(`It is not a survey-control-packet - got [${packet_str}]`);
  }
  const packet_uint8 = new Uint8Array(packet);
  return Boolean(packet_uint8[1]);
}


/**
 * Verify the packet is survey-control-packet
 *
 * @param {ArrayBuffer} packet Packet to verify
 * @returns {boolean} `packet` t is survey-control-packet: true, otherwise: false
 */
export function is_survey_control_packet(packet) {
  if(packet.byteLength != 2) return false;
  if(new Uint8Array(packet)[0] != SURVEY_CONTROL_PACKET_ID) return false;

  return true;
}
