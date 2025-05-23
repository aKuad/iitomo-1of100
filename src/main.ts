/**
 * Iitomo 1of100 survey system
 *
 * @author aKuad
 */

/* Modules import */
import { serveDir, serveFile } from "jsr:@std/http@1";

import { is_only_num_alp } from "./static/util/is_only_num_alp.js";
import { ws_participant } from "./modules/ws_participant.ts";
import { ws_moderator } from "./modules/ws_moderator.ts";


/* Global variables */
const event_core = new EventTarget();
const room_ids_moderator_connecting = new Set<string>();
const participant_count = new Map<string, number>();
const participant_yes_clients = new Map<string, Set<WebSocket>>();


/* Server main */
Deno.serve(request => {
  const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static"))
    return serveDir(request, { fsRoot: "./static", urlRoot: "static" });
  // favicon.ico should be on specially path
  if(url.pathname === "/favicon.ico")
    return serveFile(request, "./favicon.ico");


  /* Index page endpoint */
  if(url.pathname === "/")
    return serveFile(request, "./pages/en/index.html");


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
    ws_participant(socket, room_id, event_core, room_ids_moderator_connecting, participant_count, participant_yes_clients);

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
    ws_moderator(socket, room_id, event_core, room_ids_moderator_connecting, participant_count, participant_yes_clients);

    return response;


  } else if(url.pathname.startsWith("/api")) {
    return new Response("Not found", { status: 404 });
  }


  /* Pages (other of index) endpoints */
  if       (url.pathname.startsWith("/participant")) {
    return serveFile(request, "./pages/en/participant.html");

  } else if(url.pathname.startsWith("/moderator")) {
    if(room_ids_moderator_connecting.has(room_id))
      return serveFile(request, "./pages/en/moderator-dup.html");
    else
      return serveFile(request, "./pages/en/moderator.html");
  }

  return new Response(Deno.readFileSync("./pages/en/404-not-found.html"), { status: 404, headers: {"content-type": "text/html"} });
});
