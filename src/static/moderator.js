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

  const qr_field_regular = document.getElementById("config-join-qr-field");
  new QRCode(qr_field_regular, {
    text: "https://github.com",
    width: qr_field_regular.clientWidth,
    height: qr_field_regular.clientHeight
  });

  const qr_field_large = document.getElementById("large-qr-field");
  new QRCode(qr_field_large, {
    text: "https://github.com",
    width: qr_field_large.clientWidth,
    height: qr_field_large.clientHeight
  });
});
