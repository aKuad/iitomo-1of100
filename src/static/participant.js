/**
 * @file Participant UI main script
 *
 * @author aKuad
 */

import { is_boolean_packet, decode_boolean_packet, encode_boolean_packet, PACKET_ID_SURVEY_CONTROL, PACKET_ID_SURVEY_RESPONSE, PACKET_ID_MODERATOR_STATUS } from "./packet/boolean.js";


globalThis.addEventListener("load", () => {
  const room_id = location.pathname.split("/")[2];
  document.getElementById("room-id-view").innerText = room_id;

  const ws = new WebSocket(`/api/participant/${room_id}`);
  ws.binaryType = "arraybuffer";

  ws.addEventListener("message", e => {
    if(is_boolean_packet(e.data)) {
      const { packet_id, boolean_value } = decode_boolean_packet(e.data);
      switch(packet_id) {
        case PACKET_ID_SURVEY_CONTROL:
          if(boolean_value) {
            // Survey started
            document.getElementById("response-input").checked = false;
            document.getElementById("info-view").innerText = "Check here to answer 'Yes' !";
            document.getElementById("response-input").disabled = false;
          } else {
            // Survey ended
            document.getElementById("info-view").innerText = "Wait for next question...";
            document.getElementById("response-input").disabled = true;
          }
          break;

        case PACKET_ID_MODERATOR_STATUS:
          if(boolean_value) {
            // Moderator is connecting
            document.getElementById("error-view").innerText = ""; // Clear error view
          } else {
            // Moderator is not connecting
            document.getElementById("error-view").innerText = "Moderator is not here";
          }
          break;

        default:
          break;
      }
    }
  });

  ws.addEventListener("close", () => document.getElementById("error-view").innerText = "Connection closed by server");
  ws.addEventListener("error", () => document.getElementById("error-view").innerText = "Connection closed bu error");

  document.getElementById("response-input").addEventListener("input", e => {
    if(ws.readyState !== ws.OPEN) return; // When connection unavailable, do nothing
    ws.send(encode_boolean_packet(PACKET_ID_SURVEY_RESPONSE, e.target.checked));
  });
});
