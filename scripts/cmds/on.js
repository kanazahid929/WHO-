module.exports = {
  config: {
    name: "on",
    version: "1.1",
    role: 2,
    author: "DipTo",
    description: "Mention kore target set/off kore infinity bully mode",
    category: "fun",
    guide: {
      en: "{p}virus @mention   → ON\n{p}virus off @mention → OFF"
    }
  },

  langs: {
    en: {
      setSuccess: "𝗟𝗢𝗔𝗗𝗜𝗡𝗚 . . . ...\n👾🔥😈 𝗩𝗜͟𝗣 𝗝͟3-/// 𝗔͟𝗖͟͠𝗧𝗜͟͠𝗩𝗘𝗗📨💀⚡\n▓▓▓▓▓░░░░░ 99% {name} in this group 👾",
      offSuccess: "𝗩͟𝗜͟͠𝗣 𝗝͟3-/// 𝗢͟𝗙͟͠𝗙 👾 {name} in this group 📨😈",
      noMention: "__\\👾সিয়াম বস একবার পোলারে ম্যানশন দেন ওর মার  খুলে ফেলব চ !! 😈📨",
      notActive: "{name} er jonno bully mode on chilo na. 🤔"
    }
  },

  onStart: async function({ event, args, message, getLang, threadsData }) {
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
      return message.reply(getLang("noMention"));
    }

    let targetId = Object.keys(event.mentions)[0];
    let targetName = event.mentions[targetId];

    let data = await threadsData.get(event.threadID, "goatTargets", {});

    if (args[0]?.toLowerCase() === "off") {
      if (data[targetId]) {
        delete data[targetId];
        await threadsData.set(event.threadID, { goatTargets: data });
        return message.reply(getLang("offSuccess", { name: targetName }));
      } else {
        return message.reply(getLang("notActive", { name: targetName }));
      }
    }

    data[targetId] = true;
    await threadsData.set(event.threadID, { goatTargets: data });
    message.reply(getLang("setSuccess", { name: targetName }));
  },

  onChat: async function({ event, message, threadsData }) {
    let data = await threadsData.get(event.threadID, "goatTargets", {});
    if (!data || !data[event.senderID]) return;

    const bullyLines = [
      "assalamualaikum"
    ];

    let randomLine = bullyLines[Math.floor(Math.random() * bullyLines.length)];
    message.reply(randomLine);
  }
};