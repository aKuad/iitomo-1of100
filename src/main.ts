/**
 * Iitomo 1of100 survey system
 *
 * @author aKuad
 */

/* Modules import */
import { serveDir, serveFile } from "jsr:@std/http@1";

import { is_only_num_alp } from "./static/util/is_only_num_alp.js";
import { encode_boolean_packet, PACKET_ID_MODERATOR_STATUS } from "./static/packet/boolean.js";
import { encode_uint16_packet, PACKET_ID_PARTICIPANT_COUNT } from "./static/packet/uint16.js";


/* Global variables */
const event_core = new EventTarget();
const room_ids_moderator_connecting = new Set<string>();
const participant_count = new Map<string, number>();


/* Server main */
Deno.serve(request => {
  const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static"))
    return serveDir(request, { fsRoot: "./static", urlRoot: "static" });


  /* Index page endpoint */
  if(url.pathname === "/")
    return serveFile(request, "./pages/index.html");


  /* Room ID checking */
  const is_api_access = url.pathname.startsWith("/api");
  const room_id = is_api_access ? url.pathname.split("/")[3] : url.pathname.split("/")[2];
  const is_room_id_correct = Boolean(room_id) && is_only_num_alp(room_id).is_correct; // If room_id is undefined or empty string, it be false


  /* API endpoints */
  if(url.pathname.startsWith("/api/participant")) {
    // Refuse non-websocket request
    if(request.headers.get("upgrade") !== "websocket")
      return new Response("This API is for websocket, protocol upgrade required", { status: 426 });

    // ID error check
    if(!is_room_id_correct)
      return new Response("Room ID is incorrect", { status: 400 });

    // Main process of participant
    const { socket, response } = Deno.upgradeWebSocket(request);
    const moderator_status_notice = () => socket.send(encode_boolean_packet(PACKET_ID_MODERATOR_STATUS, room_ids_moderator_connecting.has(room_id)));

    //// Initial communication
    socket.addEventListener("open", moderator_status_notice);

    //// 'participant-count-update' (joined) signal to moderator
    socket.addEventListener("open", () => {
      const current_count = participant_count.get(room_id);
      if(current_count)
        participant_count.set(room_id, current_count + 1);
      else
        participant_count.set(room_id, 1);
      event_core.dispatchEvent(new Event(`participant-count-update-${room_id}`));
    });

    //// 'participant-count-update' (left) signal to moderator
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

    //// 'moderator-update' signal from moderator
    event_core.addEventListener(`moderator-update-${room_id}`, moderator_status_notice);
    socket.addEventListener("close", () => event_core.removeEventListener(`moderator-update-${room_id}`, moderator_status_notice));
    socket.addEventListener("error", () => event_core.removeEventListener(`moderator-update-${room_id}`, moderator_status_notice));

    return response;


  } else if(url.pathname.startsWith("/api/moderator")) {
    // Refuse non-websocket request
    if(request.headers.get("upgrade") !== "websocket")
      return new Response("This API is for websocket, protocol upgrade required", { status: 426 });

    // ID error check
    if(!is_room_id_correct)
      return new Response("Room ID is incorrect", { status: 400 });
    if(room_ids_moderator_connecting.has(room_id))
      return new Response("The room ID is in use by an another moderator client", { status: 400 });

    // Main process of moderator
    const { socket, response } = Deno.upgradeWebSocket(request);
    const participant_count_notice = () => socket.send(encode_uint16_packet(PACKET_ID_PARTICIPANT_COUNT, participant_count.get(room_id) || 0));
    //                   When 'participant_count.get(room_id) === undefined' (means unset), set value 0  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //// Initial communication
    socket.addEventListener("open", participant_count_notice);

    //// 'participant-count-update' signal from participant
    event_core.addEventListener(`participant-count-update-${room_id}`, participant_count_notice);
    socket.addEventListener("close", () => event_core.removeEventListener(`participant-count-update-${room_id}`, participant_count_notice));
    socket.addEventListener("error", () => event_core.removeEventListener(`participant-count-update-${room_id}`, participant_count_notice));

    //// 'moderator-update' (joined) signal to participant
    socket.addEventListener("open", () => {
      room_ids_moderator_connecting.add(room_id);
      event_core.dispatchEvent(new Event(`moderator-update-${room_id}`));
    });

    //// 'moderator-update' (left) signal to participant
    const moderator_left_signal = () => {
      room_ids_moderator_connecting.delete(room_id);
      event_core.dispatchEvent(new Event(`moderator-update-${room_id}`));
    }
    socket.addEventListener("close", moderator_left_signal);
    socket.addEventListener("error", moderator_left_signal);

    return response;


  } else if(url.pathname.startsWith("/api")) {
    return new Response("Not found", { status: 404 });
  }


  /* Pages (other of index) endpoints */
  if       (url.pathname.startsWith("/participant")) {
    return serveFile(request, "./pages/participant.html");

  } else if(url.pathname.startsWith("/moderator")) {
    if(room_ids_moderator_connecting.has(room_id))
      return serveFile(request, "./pages/moderator-dup.html");
    else
      return serveFile(request, "./pages/moderator.html");
  }

  return new Response(Deno.readFileSync("./pages/404-not-found.html"), { status: 404, headers: {"content-type": "text/html"} });
});
