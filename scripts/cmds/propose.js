let isWarOn = true;

module.exports = {
  config: {
    name: "atim",
    aliases: ["chud"],
    version: "1.3",
    author: "nexo_here + fixed by Yeasin",
    role: 2,
    category: "admin",
    guide: {
      en: "chud @mention to attack, chud off to stop"
    }
  },

  onStart: async function ({ api, event, args }) {
    const content = args.join(" ").toLowerCase();
    const mention = Object.keys(event.mentions)[0];

    // Turn off war mode
    if (content === "off") {
      isWarOn = false;
      return api.sendMessage("❌ | War mode turned OFF.", event.threadID);
    }

    // Auto turn on if mention present and war currently off
    if (mention && !isWarOn) {
      isWarOn = true;
    }

    // If war mode off, do nothing
    if (!isWarOn) return;

    // Require mention to start war messages
    if (!mention) return api.sendMessage("‎●───༆🌺●───༆༊🦋\n\n🐰✨𝐭𝐡𝐢𝐬\n𝐚𝐛𝐨𝐮𝐭 𝐥𝐢𝐧𝐞!-💜💭\n\nসিয়াম বস তুমি কোন মেয়েকে ভালোবাসা দিতে চাও মেনশন দাও 🌛😇", event.threadID);

    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    const send = msg => api.sendMessage({ body: msg, mentions: arraytag }, event.threadID);

    const messages = [
      `🐰♡︎𝗕𝗲✨🍥𝗠𝗶𝗻𝗲-!<😻🍭!🧚‍♀️𝗜🐼-𝗪𝗶𝗹𝗹✨🍒𝗸𝗲𝗲𝗽😽𝘆𝗼𝘂-🧸💜-𝗙𝗼𝗿𝗲𝘃𝗲𝗿🌈🍒তুমি আমার সাধ্যের বাহিরে চাওয়া এক সুন্দর মানুষ।।🙂💔${name}`,
      `𝗟𝗶𝗳𝗲 𝗶𝘀 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹 𝗶𝗳 𝘆𝗼𝘂 𝗗𝗼𝗻𝘁 𝗙𝗮𝗹𝗹 𝗶𝗻 𝗟𝗼𝘃𝗲 ♡︎_জীবন সুন্দর যদি কারো মায়ায় না পড়ো - ${name}`,
      ` 🐰✨𝗜 𝗟𝗼𝘃𝗲 𝗨<33 𝗦𝘂𝗰𝗵 𝗔𝗻 𝗨𝗴𝗹𝘆 𝗪𝗼𝗿𝗱✨🦋 𝗦𝗵𝗼𝘂𝗹𝗱 𝗕𝗲!ᵉ_🔐💜💫_একরাশ উচ্ছ্বাসের মাঝে আমার হটাৎ থেমে যাওয়ার কারণ তুমি🌸 ${name}`,
      ` 𝗣𝗲𝗵𝗹𝗶 𝗡𝗮𝘇𝗮𝗿 𝗠𝗮𝗶𝗻 𝗞𝗮𝗶𝗦𝗔 𝗝𝗔𝗗𝘂 𝗞𝗮𝗿 𝗗𝗶𝘆𝗔 🫶${name}`,
      ` ${name}`,
      ` ${name}`,
      ` ${name}`,
      `  ${name}`,
      
      ` ${name}`
    ];

    messages.forEach((msg, i) => {
      setTimeout(() => send(msg), 3000 * i);
    });
  }
};
