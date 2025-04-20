/**
 * Iitomo 1of100 survey system
 *
 * @author aKuad
 */

/* Modules import */
import { serveDir, serveFile } from "jsr:@std/http@1";


/* Server main */
Deno.serve(request => {
  const url = new URL(request.url);

  /* Static files endpoint */
  if(url.pathname.startsWith("/static"))
    return serveDir(request, { fsRoot: "./static", urlRoot: "static" });


  /* Index page endpoint */
  if(url.pathname === "/")
    return serveFile(request, "./pages/index.html");


  /* API endpoints */
  if(url.pathname.startsWith("/api/participant")) {
    // Refuse non-websocket request
    if(request.headers.get("upgrade") !== "websocket")
      return new Response("This API is for websocket, protocol upgrade required", { status: 426 });

    // Main process of participant
    const { response } = Deno.upgradeWebSocket(request);

    return response;


  } else if(url.pathname.startsWith("/api/moderator")) {
    // Refuse non-websocket request
    if(request.headers.get("upgrade") !== "websocket")
      return new Response("This API is for websocket, protocol upgrade required", { status: 426 });

    // Main process of moderator
    const { response } = Deno.upgradeWebSocket(request);

    return response;


  } else if(url.pathname.startsWith("/api")) {
    return new Response("Not found", { status: 404 });
  }


  /* Pages (other of index) endpoints */
  if       (url.pathname.startsWith("/participant")) {
    return serveFile(request, "./pages/participant.html");

  } else if(url.pathname.startsWith("/moderator")) {
    return serveFile(request, "./pages/moderator.html");
  }

  return new Response(Deno.readFileSync("./pages/404-not-found.html"), { status: 404, headers: {"content-type": "text/html"} });
});
