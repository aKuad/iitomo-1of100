/**
 * Iitomo 1of100 survey system
 *
 * Note: Currently, it is temporary simple HTTP server
 *
 * @author aKuad
 */

import { serveDir } from "jsr:@std/http@1";


Deno.serve(request => {
  const url = new URL(request.url);

  /* Page endpoints */
  if(url.pathname.startsWith("/static")) {
    return serveDir(request, { fsRoot: "./static", urlRoot: "static" });
  }
  return serveDir(request, { fsRoot: "./pages", urlRoot: "" });
});
