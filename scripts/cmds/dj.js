module.exports = {
  config: {
    name: "dj",
    version: "1.0",
    author: "Siyam + ChatGPT",
    role: 0,
    category: "fun",
    noPrefix: true
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const text = event.body?.toLowerCase();

    // DJ শুধুমাত্র 'dj' keyword এ চলবে
    if (!text.startsWith("dj")) return;

    // Re-act only if someone typed exactly "dj"
    if (text === "dj") {
      api.setMessageReaction("🔥", event.messageID, () => {}, true);
      return;
    }

    // Mention found after "dj"
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return;

    const name = event.mentions[mention];
    const tag = [{ id: mention, tag: name }];

    const messages = [
      `🔥 ${name}, DJ bot তোমাকে tag করা হলেই নাচতে শুরু করে 😂`,
      `🤣 ${name} ভাই, DJ beat তোমার জন্যই বাজে!`,
      `🎧 DJ Mode Activated for: ${name}`,
      `💥 ${name} আসলেই গ্রুপে DJ vibe চলে আসে!`,
      `🚀 ${name}, তোমাকে mention দিলেই DJ bass drop দেয়!`,
      `😂 DJ bot বলল: ${name} এর জন্য special track ready!`
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => {
        api.sendMessage({ body: msg, mentions: tag }, event.threadID);
      }, 1500 * i);
    });
  }
};
