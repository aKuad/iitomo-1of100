/**
 * @file Simple HTTP server for server connection required JavaScript modules tests
 *
 * Note: About test details, see each testing HTML codes.
 *
 * @author aKuad
 */

import { serveDir } from "jsr:@std/http@1";
import { decode_boolean_packet, encode_boolean_packet, is_boolean_packet, PACKET_ID_MODERATOR_STATUS, PACKET_ID_SURVEY_CONTROL } from "../../static/packet/boolean.js";


const WS_API_NO_UPGRADE_RESPONSE = new Response("This API is for websocket, protocol upgrade required", { status: 426 });


Deno.serve(request => {
  const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static")) {
    return serveDir(request, { fsRoot: "../../static", urlRoot: "static"});
  }


  /* API endpoints */
  if(url.pathname.startsWith("/api/participant")) {
    if(request.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(request);
      socket.binaryType = "arraybuffer";

      let packet_step_next = 0;
      const interval_id = setInterval(() => {
        if(socket.readyState !== socket.OPEN)
          return; // When connection unavailable, do nothing

        switch(packet_step_next) {
          case 0:
            socket.send(encode_boolean_packet(PACKET_ID_SURVEY_CONTROL, true));
            packet_step_next = 1;
            break;

          case 1:
            socket.send(encode_boolean_packet(PACKET_ID_SURVEY_CONTROL, false));
            packet_step_next = 2;
            break;

          case 2:
            socket.send(encode_boolean_packet(PACKET_ID_MODERATOR_STATUS, false));
            packet_step_next = 3;
            break;

          case 3:
            socket.send(encode_boolean_packet(PACKET_ID_MODERATOR_STATUS, true));
            packet_step_next = 0;
            break;

          default:
            break;
        }
      }, 2000);

      socket.addEventListener("message", e => {
        if(is_boolean_packet(e.data)) {
          const { packet_id, boolean_value } = decode_boolean_packet(e.data);
          console.log(`From participant UI ... Packet ID: ${packet_id}, Value: ${boolean_value}`);
        }
      });

      socket.addEventListener("close", () => clearInterval(interval_id));
      socket.addEventListener("error", () => clearInterval(interval_id));

      return response;

    } else {
      return WS_API_NO_UPGRADE_RESPONSE;
    }
  }


  /* Pages endpoints */
  if(url.pathname.startsWith("/participant")) {
    return new Response(Deno.readFileSync("../../pages/participant.html"), { status: 200, headers: {"content-type": "text/html"} });
  }

  return serveDir(request, { fsRoot: "./", urlRoot: ""});
});
