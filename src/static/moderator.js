/**
 * @file Moderator UI main script
 *
 * @author aKuad
 */

import { encode_uint16_packet, decode_uint16_packet, is_uint16_packet, PACKET_ID_PARTICIPANT_COUNT, PACKET_ID_SURVEY_START, PACKET_ID_SURVEY_RESULT } from "./packet/uint16.js";
import { Digits3Shuffle } from "./util/Digits3Shuffle.js";
import { SEPlayer } from "./util/SEPlayer.js";
import { WakeLockKeep } from "./util/WakeLockKeep.js";


globalThis.addEventListener("load", () => {
  /* Variables & UI objects */
  const room_id = location.pathname.split("/")[3];
  const se_player = new SEPlayer();
  const digits_3_shuffle = new Digits3Shuffle(document.getElementById("board-result-view"));
  let is_in_survey = false;
  const ws = new WebSocket(`/api/moderator/${room_id}`);
  ws.binaryType = "arraybuffer";


  /* Main control processes */
  // Survey start process
  function survey_start() {
    if(is_in_survey) { return; /* do nothing */ }
    is_in_survey = true;

    const se_duration = document.getElementById("config-survey-duration").value;
    const raw_packet = encode_uint16_packet(PACKET_ID_SURVEY_START, se_duration);
    ws.send(raw_packet);

    digits_3_shuffle.run();
    se_player.play();
  }
  document.getElementById("config-survey-start").addEventListener("click", survey_start);


  // Survey start by key input
  globalThis.addEventListener("keydown", e => {
    if(e.key === "Enter")
      survey_start();
  });


  // Websocket received actions
  ws.addEventListener("message", e => {
    if(is_uint16_packet(e.data)) {
      const {packet_id, uint16_value} = decode_uint16_packet(e.data);

      if(packet_id === PACKET_ID_PARTICIPANT_COUNT) {
        document.getElementById("participant-count-view").innerText = uint16_value;
      } else if(packet_id === PACKET_ID_SURVEY_RESULT) {
        digits_3_shuffle.stop();
        // '!' is blank segment on DSEG7 font
        // Fill '!' for under 99 value view
        document.getElementById("board-result-view").innerText = `!!${uint16_value}`.slice(-3);
        is_in_survey = false;
      }
    }
  });


  // Error view
  ws.addEventListener("close", () => document.getElementById("error-view").innerText = "Connection closed by server");
  ws.addEventListener("error", () => document.getElementById("error-view").innerText = "Connection closed by error");


  // On page leave
  globalThis.addEventListener("beforeunload", () => {
    document.getElementById("error-view").style.display = "none"; // Error view disable for correctly disconnection
    ws.close();
  });


  /* Config view/hide process */
  // By screen button
  document.getElementById("config-view-toggle-show").addEventListener("click", () => {
    document.getElementById("config-view-toggle").checked = true;
    document.getElementById("config-view-toggle-show").style.opacity = 0.0;
  });
  document.getElementById("config-view-toggle-hide").addEventListener("click", () => {
    document.getElementById("config-view-toggle").checked = false;
    document.getElementById("config-view-toggle-show").style.opacity = "";  // Unset inline style
  });

  // By key input
  globalThis.addEventListener("keydown", e => {
    if(e.key === "Escape") {
      document.getElementById("config-view-toggle").click();
      document.getElementById("config-view-toggle-show").style.opacity = 0.0; // By key control, hide config show button
    }
  });


  /* Config processes */
  // Sound effect settings
  document.getElementById("config-se-file-in").addEventListener("input", async e => {
    const input_file = e.target.files[0];
    if(input_file) {
      const se_duration = await se_player.set_file(input_file);
      document.getElementById("config-survey-duration").value = Math.round(se_duration);
      document.getElementById("config-se-name").innerText = input_file.name;
    }
  });

  document.getElementById("config-se-unset").addEventListener("click", () => {
    se_player.unset_file();
    document.getElementById("config-se-name").innerText = "";
  });

  document.getElementById("config-se-volume").addEventListener("input", e => {
    se_player.set_gain(e.target.value);
  });


  // WakeLock
  const wake_lock_keep = new WakeLockKeep();
  if(!wake_lock_keep.is_wakelock_available) {
    document.getElementById("config-wakelock-enable").style.display = "none";
    document.getElementById("config-wakelock-unsupported-mes").style.display = "";
  }

  document.getElementById("config-wakelock-enable").addEventListener("input", e => {
    if(e.target.checked)
      wake_lock_keep.enable();
    else
      wake_lock_keep.disable();
  });


  // Room ID view
  document.getElementById("config-room-id").innerText = room_id;


  // Participant join URL and QR view
  const join_url = `${location.origin}/participant/${room_id}`;
  const qr_field_regular = document.getElementById("config-join-qr-field");
  new QRCode(qr_field_regular, {
    text: join_url,
    width: 1000,  // Enough resolution, no specially meaning
    height: 1000
  });
  qr_field_regular.getElementsByTagName("img")[0].style.width = "100%";   // <img> generated by QRCode, then mod it to fitting "config-join-qr-field"
  qr_field_regular.getElementsByTagName("img")[0].style.height = "100%";  //

  const qr_field_large = document.getElementById("large-qr-field");
  new QRCode(qr_field_large, {
    text: join_url,
    width: 1000,  // Enough resolution, no specially meaning
    height: 1000
  });
  qr_field_large.getElementsByTagName("img")[0].style.width = "100%";   // <img> generated by QRCode, then mod it to fitting "large-qr-field"
  qr_field_large.getElementsByTagName("img")[0].style.height = "100%";  //

  document.getElementById("config-join-url").innerText = join_url;
  document.getElementById("config-join-url").href = join_url;
});
