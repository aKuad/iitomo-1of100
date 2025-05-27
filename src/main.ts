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
const SUPPORTED_LANGS = ["ja", "en"];


/* Server main */
Deno.serve(request => {
  const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static"))
    return serveDir(request, { fsRoot: "./static", urlRoot: "static" });
  // favicon.ico should be on specially path
  if(url.pathname === "/favicon.ico")
    return serveFile(request, "./favicon.ico");


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


  /* Check lang select on URL - Redirect when no lang specified URL */
  const page_lang = url.pathname.split("/")[1]; // URL structure is '/<lang>/<page_path>' ... [1] means <lang>
  const page_path = url.pathname.split("/").slice(2).join("/");

  if(!SUPPORTED_LANGS.includes(page_lang)) {
    const browser_first_lang = request.headers.get("accept-language")?.replace(/(-|,|;).*/, "") || "en";  // "en" as default lang
    // Replace after '-' -> remove country code
    //               ',' -> remove second and later language code
    //               ';' -> remove q-factor weighting
    const new_url = new URL(url);

    if(browser_first_lang === "ja")
      new_url.pathname = "/ja" + new_url.pathname;
    else
      new_url.pathname = "/en" + new_url.pathname;
    console.log(new_url);

    return new Response(null, { status: 303, headers: new Headers({ location: new_url.href })});
  }


  /* Index page endpoint */
  if(page_path === "")  // index
    return serveFile(request, `./pages/${page_lang}/index.html`);


  /* Pages (other of index) endpoints */
  if       (page_path.startsWith("participant")) {
    return serveFile(request, `./pages/${page_lang}/participant.html`);

  } else if(page_path.startsWith("moderator")) {
    if(room_ids_moderator_connecting.has(room_id))
      return serveFile(request, `./pages/${page_lang}/moderator-dup.html`);
    else
      return serveFile(request, `./pages/${page_lang}/moderator.html`);
  }

  return new Response(Deno.readFileSync(`./pages/${page_lang}/404-not-found.html`), { status: 404, headers: {"content-type": "text/html"} });
});
