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

    // ---------- ONLY TRIGGER IF MESSAGE STARTS WITH "dj" ----------
    // অর্থাৎ শুধু mention দিলে DJ command কাজ করবে না
    if (!text.startsWith("dj")) return;

    // ---------- REACT ----------
    if (text === "dj") {
      api.setMessageReaction("🎧", event.messageID, () => {}, true);
      return api.sendMessage(
        "⚠️ | DJ চালাতে হলে কাউকে mention করেন!",
        event.threadID,
        event.messageID
      );
    }

    // ---------- MUST HAVE MENTION ----------
    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
      return api.sendMessage(
        "⚠️ | DJ চালাতে হলে কাউকে mention করতে হবে!",
        event.threadID,
        event.messageID
      );
    }

    const name = event.mentions[mention];
    const tag = [{ id: mention, tag: name }];

    // ---------- DJ Messages ----------
    const messages = [
      `🎧🔥 DJ Beat Dropped for ${name}!`,
      `💥 ${name} ভাই, DJ bot বলছে—"Bass Ready!"`,
      `🤣 Only for ${name} — DJ Special Track Playing!`,
      `🚀 ${name}, তোমার vibe এ group এখন নাচতেছে!`,
      `🎶 DJ Mode Activated — Respect for ${name}!`,
      `😂 DJ bot: "Ei ${name}, tomar jonno extra bass!"`
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => {
        api.sendMessage({ body: msg, mentions: tag }, event.threadID);
      }, 1700 * i);
    });
  }
};
