class MessageDeduplicator {
  constructor(cacheTimeMs = 60000) {
    this.processedMessages = new Set();
    this.cacheTimeMs = cacheTimeMs;
  }

  /**
   * Check if a message ID has been recently processed.
   * If not, adds it to the cache and schedules auto-removal.
   * @param {string} messageId 
   * @returns {boolean} true if duplicate, false if new
   */
  isDuplicate(messageId) {
    if (this.processedMessages.has(messageId)) {
      return true;
    }
    this.processedMessages.add(messageId);

    setTimeout(() => {
      this.processedMessages.delete(messageId);
    }, this.cacheTimeMs);

    return false;
  }
}

module.exports = MessageDeduplicator;
