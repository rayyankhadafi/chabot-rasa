const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const QR_FILE_PATH = path.resolve(__dirname, "../../qr.html");

async function generateQrHtml(qrString) {
  try {
    const image = await QRCode.toDataURL(qrString);
    const htmlContent = `<html>
  <head><title>WhatsApp Bot QR Code</title></head>
  <body style="
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    background:#111;
    margin:0;
  ">
    <img src="${image}" alt="WhatsApp QR Code" />
  </body>
</html>`;

    fs.writeFileSync(QR_FILE_PATH, htmlContent);
    console.log("[QR] QR code updated and saved to qr.html");
    return true;
  } catch (err) {
    console.error("[QR Error] Failed to generate QR code HTML:", err.message);
    return false;
  }
}

function getQrFilePath() {
  return QR_FILE_PATH;
}

module.exports = {
  generateQrHtml,
  getQrFilePath,
};
