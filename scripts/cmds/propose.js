module.exports = {
  config: {
    name: "propose",
    version: "1.1",
    author: "Siyam + ChatGPT",
    role: 0,
    category: "fun",
    noPrefix: true
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const text = event.body?.toLowerCase();

    // শুধু 'propose' keyword trigger করবে
    if (!text.startsWith("propose")) return;

    // React on just "propose"
    if (text === "propose") {
      api.setMessageReaction("💍", event.messageID, () => {}, true);
      return;
    }

    // Mention check
    const mentionId = Object.keys(event.mentions || {})[0];
    if (!mentionId) {
      // যদি mention না থাকে
      const noMentionMessage = `───༆🌺●───༆༊🦋\n\n🐰✨𝐭𝐡𝐢𝐬\n𝐚𝐛𝐨𝐮𝐭 𝐥𝐢𝐧𝐞!-💜💭\n\nসিয়াম বস তুমি কোন মেয়েকে ভালোবাসা দিতে চাও মেনশন দাও 🌛😇`;
      api.sendMessage(noMentionMessage, event.threadID, event.messageID);
      api.setMessageReaction("💌", event.messageID, () => {}, true);
      return;
    }

    const name = event.mentions[mentionId];
    const tag = [{ id: mentionId, tag: name }];

    // Sequential messages with custom text
    const messages = [
      `●───༆🌺●───༆༊🦋\n\n🐰✨𝐭𝐡𝐢𝐬\n𝐚𝐛𝐨𝐮𝐭 𝐥𝐢𝐧𝐞!-💜💭\n\nসিয়াম বস তুমি কোন মেয়েকে ভালোবাসা দিতে চাও মেনশন দাও 🌛😇\n\n❤️ ${name}`,
      `💌 ${name}, এই প্রস্তাব শুধু তোমার জন্য! 💖`,
      `🥰 ${name}, তুমি কি YES বলবে? 💍`,
      `🌹 ${name}, তুমি কি আমার সাথে প্রেম করবে? 💌`
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => {
        api.sendMessage({ body: msg, mentions: tag }, event.threadID);
      }, 2000 * i);
    });

    api.setMessageReaction("💘", event.messageID, () => {}, true);
  }
};
