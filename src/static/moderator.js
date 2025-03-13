/**
 * @file Moderator UI main script
 *
 * @author aKuad
 */

globalThis.addEventListener("load", () => {
  globalThis.addEventListener("keydown", e => {
    if(e.key === "Escape") {
      document.getElementById("config-view-toggle").click();
    }
  });

  new QRCode(document.getElementById("config-join-qr"), {
    text: "https://github.com",
    width: 200,
    height: 200
  });
});
