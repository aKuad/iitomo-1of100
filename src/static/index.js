/**
 * @file Index (app entrance) main script
 *
 * @author aKuad
 */

import { is_only_num_alp } from "./util/is_only_num_alp.js";
import { random_str_gen } from "./util/random_str_gen.js";

globalThis.addEventListener("load", () => {
  document.getElementById("room-id-input").placeholder = random_str_gen(10);

  document.getElementById("room-id-input").addEventListener("input", e => {
    const room_id = e.target.value || e.target.placeholder;

    const {is_correct, incorrect_reason} = is_only_num_alp(room_id);
    if(is_correct) {
      document.getElementById("join-participant").href = `/participant/${room_id}`;
      document.getElementById("join-moderator").href = `/moderator/${room_id}`;
      document.getElementById("join-participant").classList.remove("link-disabled");
      document.getElementById("join-moderator").classList.remove("link-disabled");
      document.getElementById("room-id-error").innerText = "";
    } else {
      document.getElementById("join-participant").href = "";
      document.getElementById("join-moderator").href = "";
      document.getElementById("join-participant").classList.add("link-disabled");
      document.getElementById("join-moderator").classList.add("link-disabled");
      document.getElementById("room-id-error").innerText = incorrect_reason;
    }
  });

  // For initialize join link
  document.getElementById("room-id-input").dispatchEvent(new Event("input"));
});
