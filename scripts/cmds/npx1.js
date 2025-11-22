const fs = require("fs");

module.exports = {
  config: {
    name: "npx1",
    version: "1.0.3",
    prefix: false,
    permssion: 0,
    credits: "seyssjam",
    description: "auto voice trigger (fixed ready)",
    category: "no prefix",
    usages: "🤗",
    cooldowns: 5
  },

  onChat: async ({ api, event }) => {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();
    const triggers = ["😌", "npx", "love", "valo", "hi"];

    if (triggers.some(k => text.includes(k))) {
      // Fixed voice file
      const voiceFile = "fg.mp3"; // শুধু এই ফাইল play হবে

      await api.sendMessage({
        body: "❤️‍🔥😺 Tor bal Kaz kora 😹",
        attachment: fs.createReadStream(__dirname + `/siyam/${voiceFile}`)
      }, threadID);

      // Fixed reaction
      api.setMessageReaction("💋", messageID, () => {}, true);
    }
  }
};
