let isWarOn = true;

module.exports = {
  config: {
    name: "dj",
    version: "2.0",
    author: "Siyam + ChatGPT",
    role: 2,
    category: "admin",
  },

  onStart: async function ({ api, event, args }) {
    const content = args.join(" ").toLowerCase();

    if (content === "off") {
      isWarOn = false;
      return api.sendMessage("⚠️ | War mode OFF.", event.threadID);
    }
  },

  onChat: async function ({ api, event }) {

    if (!isWarOn) return;

    const mention = Object.keys(event.mentions)[0];
    if (!mention) return;

    const name = event.mentions[mention];
    const tag = [{ id: mention, tag: name }];

    const messages = [
      `🔥👾 ${name}, ভাই তুমি এত famous কেন? তোমাকে mention দিলে Bot নিজেই online হয়ে যায় 😭😂`,
      `🤣 ${name} কে দেখে algorithm ও confuse হয়ে গেছে! ভাই একটু slow চালান!`,
      `😹 ${name} এলে গ্রুপে বাতাস ও চুপ হয়ে যায়। Hero entry detected 🚀`,
      `🗿 ${name} ভাই, আজকে একটু শান্ত থাকেন, সবাই ভয় পাইছে.`,
      `⚡ ${name} কে tag দিলে system auto roast mode ON হয় ⚙️😂`,
      `😂 ভাই ${name} এর কথা শুনলে Messenger ও lag খায়, কি পাওয়ার!`,
      `🤖 Bot calculation: 1+1 = ${name} এর Attitude 😭`,
      `🔥 ${name}, তোমার fan club খুলে দিলাম, entry ফ্রি!`
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => {
        api.sendMessage(
          { body: msg, mentions: tag },
          event.threadID
        );
      }, 2000 * i);
    });
  }
};
