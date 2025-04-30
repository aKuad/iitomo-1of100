/**
 * @file Websocket process of moderator client
 *
 * @author aKuad
 */

import { encode_uint16_packet, PACKET_ID_PARTICIPANT_COUNT } from "../static/packet/uint16.js";


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
}
