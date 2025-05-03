/**
 * @file Websocket process of participant client
 *
 * @author aKuad
 */

import { encode_boolean_packet, decode_boolean_packet, is_boolean_packet, PACKET_ID_MODERATOR_STATUS, PACKET_ID_SURVEY_CONTROL, PACKET_ID_SURVEY_RESPONSE } from "../static/packet/boolean.js";


/**
 * Append websocket process of participant client to passed instance
 *
 * @param socket WebSocket instance of participant client connection
 * @param room_id Room ID of the client
 * @param event_core Event communication between moderator
 * @param room_ids_moderator_connecting Room IDs what moderator connecting
 * @param participant_count Participant count of each room ID
 * @param participant_yes_clients Participant websocket instances what respond 'yes' of each room ID
 */
export function ws_participant(socket: WebSocket,
                               room_id: string,
                               event_core: EventTarget,
                               room_ids_moderator_connecting: Set<string>,
                               participant_count: Map<string, number>,
                               participant_yes_clients: Map<string, Set<WebSocket>>) {

  socket.binaryType = "arraybuffer";

  // Macros
  const moderator_status_notice = () => socket.send(encode_boolean_packet(PACKET_ID_MODERATOR_STATUS, room_ids_moderator_connecting.has(room_id)));
  const survey_start_notice = () => socket.send(encode_boolean_packet(PACKET_ID_SURVEY_CONTROL, true));
  const survey_end_notice = () => socket.send(encode_boolean_packet(PACKET_ID_SURVEY_CONTROL, false));


  // Initial communication
  socket.addEventListener("open", moderator_status_notice);


  // 'participant-count-update' (joined) signal to moderator
  socket.addEventListener("open", () => {
    const current_count = participant_count.get(room_id);
    if(current_count)
      participant_count.set(room_id, current_count + 1);
    else
      participant_count.set(room_id, 1);
    event_core.dispatchEvent(new Event(`participant-count-update-${room_id}`));
  });


  // 'participant-count-update' (left) signal to moderator
  const participant_decrease_signal = () => {
    const current_count = participant_count.get(room_id);
    if(!current_count)
      return; // Invalid case - participant left but count already 0 (undefined)
    else if(current_count === 1)
      participant_count.delete(room_id);
    else
      participant_count.set(room_id, current_count - 1);
    event_core.dispatchEvent(new Event(`participant-count-update-${room_id}`));
  }
  socket.addEventListener("close", participant_decrease_signal);
  socket.addEventListener("error", participant_decrease_signal);


  // 'moderator-update' signal from moderator
  event_core.addEventListener(`moderator-update-${room_id}`, moderator_status_notice);
  socket.addEventListener("close", () => event_core.removeEventListener(`moderator-update-${room_id}`, moderator_status_notice));
  socket.addEventListener("error", () => event_core.removeEventListener(`moderator-update-${room_id}`, moderator_status_notice));


  // 'survey-start' signal from moderator
  event_core.addEventListener(`survey-start-${room_id}`, survey_start_notice);
  socket.addEventListener("close", () => event_core.removeEventListener(`survey-start-${room_id}`, survey_start_notice));
  socket.addEventListener("error", () => event_core.removeEventListener(`survey-start-${room_id}`, survey_start_notice));


  // 'survey-end' signal from moderator
  event_core.addEventListener(`survey-end-${room_id}`, survey_end_notice);
  socket.addEventListener("close", () => event_core.removeEventListener(`survey-end-${room_id}`, survey_end_notice));
  socket.addEventListener("error", () => event_core.removeEventListener(`survey-end-${room_id}`, survey_end_notice));


  // survey-response type packet receiving process
  socket.addEventListener("message", e => {
    if(is_boolean_packet(e.data)) {
      const { packet_id, boolean_value } = decode_boolean_packet(e.data);

      if(packet_id === PACKET_ID_SURVEY_RESPONSE) {
        if(boolean_value) {
          // Set respond 'yes'
          participant_yes_clients.get(room_id)?.add(socket);
          // Duplicated addition is no effect because of Set object specification
        } else {
          // Unset respond 'yes'
          participant_yes_clients.get(room_id)?.delete(socket);
          // Duplicated deletion is no effect because of Set object specification
        }
      }
    }
  })
}
