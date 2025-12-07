module.exports = {
  config: {
    name: "dj",
    version: "2.0",
    author: "Siyam + ChatGPT",
    role: 0,
    category: "fun",
    noPrefix: true
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {

    const text = event.body?.toLowerCase() || "";

    // DJ must only work if "dj" word exists
    if (!text.includes("dj")) return;

    // React on "dj"
    if (text === "dj") {
      api.setMessageReaction("🎧", event.messageID, () => {}, true);
      return;
    }

    // Only run if mention exists BUT dj word must also exist
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return;

    const name = event.mentions[mention];
    const tag = [{ id: mention, tag: name }];

    const messages = [
      `🎧 ${name}, DJ তোমার জন্য স্পেশাল Beat drop দিলো!`,
      `🔥 DJ Mode Activated for ${name}!`,
      `💥 ${name}, তোমার vibe এ DJ bot নাচতেছে 😂`,
      `🎵 ${name}, তোমাকে tag করা মানেই DJ Bass Boost!`,
      `🚀 DJ বলছে: ${name} আসলে party শুরু 💣`,
      `🤣 ${name}, DJ bot তোমার জন্য remix বানাইছে!`
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => {
        api.sendMessage(
          { body: msg, mentions: tag },
          event.threadID
        );
      }, 1500 * i);
    });
  }
};
