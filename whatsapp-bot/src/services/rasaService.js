const axios = require("axios");
const config = require("../config");

/**
 * Sends incoming message text to the Rasa webhook server and returns formatted reply text.
 * @param {string} senderId - WhatsApp sender ID (e.g. 628xxx@c.us)
 * @param {string} messageText - Content of the incoming WhatsApp message
 * @returns {Promise<string|null>} Combined reply string or null if no response/error
 */
async function sendMessageToRasa(senderId, messageText) {
  try {
    const response = await axios.post(config.rasaUrl, {
      sender: senderId,
      message: messageText,
    });

    if (!Array.isArray(response.data)) {
      return null;
    }

    const combinedText = response.data
      .map((msg) => msg.text)
      .filter(Boolean)
      .join("\n\n");

    return combinedText || null;
  } catch (err) {
    console.error("[Rasa Error] Failed to communicate with Rasa webhook:", err.message);
    return null;
  }
}

module.exports = {
  sendMessageToRasa,
};
