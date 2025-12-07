module.exports = {
  config: {
    name: "propose",
    version: "1.4",
    author: "Siyam + ChatGPT",
    role: 0,
    category: "fun",
    noPrefix: true
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const text = event.body?.toLowerCase();

    // Trigger only on "propose"
    if (text !== "propose") return;

    const mentionId = Object.keys(event.mentions)[0];

    if (mentionId) {
      // If someone is mentioned
      const name = event.mentions[mentionId];
      const tag = [{ id: mentionId, tag: name }];

      const messages = [
        `🐰♡︎𝗕𝗲✨🍥𝗠𝗶𝗻𝗲-!<😻🍭!🧚‍♀️𝗜🐼-𝗪𝗶𝗹𝗹✨🍒𝗸𝗲𝗲𝗽😽𝘆𝗼𝘂-🧸💜-𝗙𝗼𝗿𝗲𝘃𝗲𝗿🌈🍒তুমি আমার সাধ্যের বাহিরে চাওয়া এক সুন্দর মানুষ।।🙂💔${name}`,
        `𝗟𝗶𝗳𝗲 𝗶𝘀 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗶𝗳 𝘆𝗼𝘂 𝗗𝗼𝗻𝗧 𝗙𝗮𝗹𝗹 𝗶𝗻 𝗟𝗼𝘃𝗲 ♡︎_জীবন সুন্দর যদি কারো মায়ায় না পড়ো - ${name}`,
        `🐰✨𝗜 𝗟𝗼𝘃𝗲 𝗨<33 𝗦𝘂𝗰𝗵 𝗔𝗻 𝗨𝗴𝗹𝘆 𝗪𝗼𝗿𝗱✨🦋 𝗦𝗵𝗼𝘂𝗹𝗱 𝗕𝗲!ᵉ_🔐💜💫_একরাশ উচ্ছ্বাসের মাঝে আমার হটাৎ থেমে যাওয়ার কারণ তুমি🌸 ${name}`,
        ` 𝗣𝗲𝗵𝗹𝗶 𝗡𝗮𝘇𝗮𝗿 𝗠𝗮𝗶𝗻 𝗞𝗮𝗶𝗦𝗔 𝗝𝗔𝗗𝘜 𝗞𝗮𝗿 𝗗𝗶𝘆𝗔 🫶${name}`,
        `!!লাইন টা তুমার জন্য  ডুবেছি আমি তুমার প্রেমের অনন্ত মায়ায় 🙈 🌸${name}`,
        `সিয়াম বসের ভালোবাসা শেষ হয়না পাগল এগুলো সামান্য নমুনা 🥺💚💫${name}`
      ];

      // Sequentially send each message with 2 seconds gap
      messages.forEach((msg, i) => {
        setTimeout(() => {
          api.sendMessage({ body: msg, mentions: tag }, event.threadID);
        }, 2000 * i);
      });

      // React to the original message
      api.setMessageReaction("💘", event.messageID, () => {}, true);
    } else {
      // If no mention
      const message = `──༆🌺●───༆༊🦋

সিয়াম বস তুমি কোন মেয়েকে ভালোবাসা দিতে চাও মেনশন দাও 🌛😇`;

      api.sendMessage(message, event.threadID, event.messageID);
      api.setMessageReaction("💌", event.messageID, () => {}, true);
    }
  }
};
