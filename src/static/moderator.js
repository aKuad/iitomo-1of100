/**
 * @file Moderator UI main script
 *
 * @author aKuad
 */

import { decode_uint16_packet, is_uint16_packet, PACKET_ID_PARTICIPANT_COUNT, PACKET_ID_SURVEY_RESULT } from "./packet/uint16.js";
import { Digits3Shuffle } from "./util/Digits3Shuffle.js";
import { encode_uint16_packet, PACKET_ID_SURVEY_START } from "./packet/uint16.js";
import { SEPlayer } from "./util/SEPlayer.js";


globalThis.addEventListener("load", () => {
  const room_id = location.pathname.split("/")[2];
  const se_player = new SEPlayer();
  const digits_3_shuffle = new Digits3Shuffle(document.getElementById("board-body"));
  let is_in_survey = false;
  const ws = new WebSocket(`/api/moderator/${room_id}`);
  ws.binaryType = "arraybuffer";

  globalThis.addEventListener("keydown", e => {
    if(e.key === "Escape") {
      document.getElementById("config-view-toggle").click();

    } else if(e.key === "Enter") {
      if(is_in_survey) { return; /* do nothing */ }
      is_in_survey = true;

      const se_duration = document.getElementById("config-survey-duration").value;
      const raw_packet = encode_uint16_packet(PACKET_ID_SURVEY_START, se_duration);
      ws.send(raw_packet);

      digits_3_shuffle.run();
      se_player.play();
    }
  });

  ws.addEventListener("message", e => {
    if(is_uint16_packet(e.data)) {
      const {packet_id, uint16_value} = decode_uint16_packet(e.data);

      if(packet_id === PACKET_ID_PARTICIPANT_COUNT) {
        document.getElementById("participant-count-view").innerText = uint16_value;
      } else if(packet_id === PACKET_ID_SURVEY_RESULT) {
        digits_3_shuffle.stop();
        // '!' is blank segment on DSEG7 font
        // Fill '!' for under 99 value view
        document.getElementById("board-body").innerText = `!!${uint16_value}`.slice(-3);
        is_in_survey = false;
      }
    }
  });

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

  document.getElementById("config-room-id").innerText = room_id;

  const qr_field_regular = document.getElementById("config-join-qr-field");
  new QRCode(qr_field_regular, {
    text: `${location.origin}/participant/${room_id}`,
    width: qr_field_regular.clientWidth,
    height: qr_field_regular.clientHeight
  });

  const qr_field_large = document.getElementById("large-qr-field");
  new QRCode(qr_field_large, {
    text: `${location.origin}/participant/${room_id}`,
    width: qr_field_large.clientWidth,
    height: qr_field_large.clientHeight
  });

  ws.addEventListener("close", () => document.getElementById("error-view").innerText = "Connection closed by server");
  ws.addEventListener("error", () => document.getElementById("error-view").innerText = "Connection closed bu error");
});
