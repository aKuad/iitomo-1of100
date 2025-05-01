/**
 * @file Websocket process of moderator client
 *
 * @author aKuad
 */

import { encode_uint16_packet, decode_uint16_packet, is_uint16_packet, PACKET_ID_PARTICIPANT_COUNT, PACKET_ID_SURVEY_RESULT, PACKET_ID_SURVEY_START } from "../static/packet/uint16.js";


/**
 * Append websocket process of moderator client to passed instance
 *
 * @param socket WebSocket instance of moderator client connection
 * @param room_id Room ID of the client
 * @param event_core Event communication between moderator
 * @param room_ids_moderator_connecting Room IDs what moderator connecting
 * @param participant_count Participant count of each room ID
 */
export function ws_moderator(socket: WebSocket,
                             room_id: string,
                             event_core: EventTarget,
                             room_ids_moderator_connecting: Set<string>,
                             participant_count: Map<string, number>) {

  socket.binaryType = "arraybuffer";

  // Macros
  const participant_count_notice = () => socket.send(encode_uint16_packet(PACKET_ID_PARTICIPANT_COUNT, participant_count.get(room_id) || 0));
  //                   When 'participant_count.get(room_id) === undefined' (means unset), set value 0  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  // Initial communication
  socket.addEventListener("open", participant_count_notice);


  // 'participant-count-update' signal from participant
  event_core.addEventListener(`participant-count-update-${room_id}`, participant_count_notice);
  socket.addEventListener("close", () => event_core.removeEventListener(`participant-count-update-${room_id}`, participant_count_notice));
  socket.addEventListener("error", () => event_core.removeEventListener(`participant-count-update-${room_id}`, participant_count_notice));


  // 'moderator-update' (joined) signal to participant
  socket.addEventListener("open", () => {
    room_ids_moderator_connecting.add(room_id);
    event_core.dispatchEvent(new Event(`moderator-update-${room_id}`));
  });


  // 'moderator-update' (left) signal to participant
  const moderator_left_signal = () => {
    room_ids_moderator_connecting.delete(room_id);
    event_core.dispatchEvent(new Event(`moderator-update-${room_id}`));
  }
  socket.addEventListener("close", moderator_left_signal);
  socket.addEventListener("error", moderator_left_signal);


  // Survey sequence
  socket.addEventListener("message", e => {
    if(is_uint16_packet(e.data)) {
      const { packet_id, uint16_value } = decode_uint16_packet(e.data);

      // Triggered by survey-start type packet
      if(packet_id === PACKET_ID_SURVEY_START) {
        const survey_duration_ms = uint16_value * 1000;
        // When survey duration 0, just only return result 0
        if(survey_duration_ms === 0) {
          socket.send(encode_uint16_packet(PACKET_ID_SURVEY_RESULT, 0));
          return;
        }

        // Main sequence
        //// 'survey-start' signal to participant
        event_core.dispatchEvent(new Event(`survey-start-${room_id}`));
        //// 'survey-end' signal at (survey duration - 0.5)[sec] elapsed
        setTimeout(() => {
          event_core.dispatchEvent(new Event(`survey-end-${room_id}`));
        }, survey_duration_ms - 500);
        //// Return survey result at survey duration elapsed
        setTimeout(() => {
          socket.send(encode_uint16_packet(PACKET_ID_SURVEY_RESULT, 1));  // Temporary implement: keep result 1
        }, survey_duration_ms);
      }
    }
  });
}
