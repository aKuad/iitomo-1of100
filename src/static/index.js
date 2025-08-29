/**
 * @file Index (app entrance) main script
 *
 * @author aKuad
 */

import { is_only_num_alp } from "./util/is_only_num_alp.js";
import { random_str_gen } from "./util/random_str_gen.js";

globalThis.addEventListener("load", () => {
  // Room ID restore & Default room ID set
  document.getElementById("room-id-input").placeholder = random_str_gen(10);
  document.getElementById("room-id-input").value = localStorage.getItem("last-input-room-id") || "";

  // Room ID input process
  document.getElementById("room-id-input").addEventListener("input", e => {
    const room_id = e.target.value || e.target.placeholder;

    const id_check_result = is_only_num_alp(room_id);
    if(id_check_result === 0) {
      document.getElementById("join-participant").href = `./participant/${room_id}`;
      document.getElementById("join-moderator").href = `./moderator/${room_id}`;
      document.getElementById("join-participant").classList.remove("link-disabled");
      document.getElementById("join-moderator").classList.remove("link-disabled");
      document.getElementsByClassName("room-id-error-select")[0].checked = true;
    } else {
      document.getElementById("join-participant").href = "";
      document.getElementById("join-moderator").href = "";
      document.getElementById("join-participant").classList.add("link-disabled");
      document.getElementById("join-moderator").classList.add("link-disabled");
      document.getElementsByClassName("room-id-error-select")[id_check_result].checked = true;
    }
  });

  // Room ID store
  function on_room_id_entered() {
    const room_id_input = document.getElementById("room-id-input").value;
    if(room_id_input)
      localStorage.setItem("last-input-room-id", room_id_input);
    else
      localStorage.removeItem("last-input-room-id");
  }
  document.getElementById("join-participant").addEventListener("click", on_room_id_entered);
  document.getElementById("join-moderator").addEventListener("click", on_room_id_entered);

  // For initialize join link
  document.getElementById("room-id-input").dispatchEvent(new Event("input"));
});
