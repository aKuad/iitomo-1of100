/**
 * @file Participant UI main script
 *
 * @author aKuad
 */

import { is_boolean_packet, decode_boolean_packet, encode_boolean_packet, PACKET_ID_SURVEY_CONTROL, PACKET_ID_SURVEY_RESPONSE, PACKET_ID_MODERATOR_STATUS } from "./packet/boolean.js";
import { WakeLockKeep } from "./util/WakeLockKeep.js";


globalThis.addEventListener("load", () => {
  /* UI initial */
  const room_id = location.pathname.split("/")[3];
  document.getElementById("room-id-view").innerText = room_id;


  /* Variables */
  const ws = new WebSocket(`/api/participant/${room_id}`);
  ws.binaryType = "arraybuffer";


  /* UI control by server signal */
  ws.addEventListener("message", e => {
    if(is_boolean_packet(e.data)) {
      const { packet_id, boolean_value } = decode_boolean_packet(e.data);
      switch(packet_id) {
        case PACKET_ID_SURVEY_CONTROL:
          if(boolean_value) {
            // Survey started
            document.getElementById("response-input").checked = false;
            document.getElementsByClassName("info-view-select")[1].checked = true;
            document.getElementById("response-input").disabled = false;
          } else {
            // Survey ended
            document.getElementsByClassName("info-view-select")[2].checked = true;
            document.getElementById("response-input").disabled = true;
          }
          break;

        case PACKET_ID_MODERATOR_STATUS:
          if(boolean_value) {
            // Moderator is connecting
            document.getElementById("error-mes-no-moderator").style.display = "none";  // Hide error mes
          } else {
            // Moderator is not connecting
            document.getElementById("error-mes-no-moderator").style.display = ""; // View error mes
          }
          break;

        default:
          break;
      }
    }
  });

  ws.addEventListener("close", () => document.getElementById("error-view").innerText = "Connection closed by server");
  ws.addEventListener("error", () => document.getElementById("error-view").innerText = "Connection closed by error");


  /* Response process */
  document.getElementById("response-input").addEventListener("input", e => {
    if(ws.readyState !== ws.OPEN) return; // When connection unavailable, do nothing
    ws.send(encode_boolean_packet(PACKET_ID_SURVEY_RESPONSE, e.target.checked));
  });


  /* WakeLock control */
  const wake_lock_keep = new WakeLockKeep();
  if(!wake_lock_keep.is_wakelock_available) {
    document.getElementById("wakelock-enable").disabled = true;
    document.getElementById("wakelock-enable-label").style.display = "none";
    document.getElementById("wakelock-enable-label-unsupported").style.display = "";
  }

  document.getElementById("wakelock-enable").addEventListener("input", e => {
    if(e.target.checked)
      wake_lock_keep.enable();
    else
      wake_lock_keep.disable();
  });
});
