const fs = require("fs");

module.exports = {
  config: {
    name: "npx1",
    version: "1.0.1",
    prefix: false,
    permssion: 0,
    credits: "seyssjam",
    description: "auto voice trigger",
    category: "no prefix",
    usages: "🤗",
    cooldowns: 5
  },

  handleEvent: function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();

    // 🔥 এখানে যে শব্দ লিখবা সেটা পেলে বট ভয়েস পাঠাবে
    const triggers = ["😌", "npx", "love", "valo", "hi"];

    // যদি কোনো ট্রিগার শব্দ মেসেজে থাকে
    if (triggers.some(key => text.includes(key))) {

      const msg = {
        body: "❤️‍🔥😺",
        attachment: fs.createReadStream(__dirname + `/siyam/fg.mp3`)
      };

      api.sendMessage(msg, threadID, messageID);
      api.setMessageReaction("💋", messageID, () => {}, true);
    }
  },

  start: function () {}
};
