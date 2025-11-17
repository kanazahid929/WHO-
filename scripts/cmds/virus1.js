module.exports = {
  config: {
    name: "virus1",
    version: "1.1",
    role: 2,
    author: "siyam",
    description: "Mention kore target set/off kore infinity bully mode",
    category: "fun",
    guide: {
      en: "{p}virus @mention   → ON\n{p}virus off @mention → OFF"
    }
  },

  langs: {
    en: {
      setSuccess: "𝗟𝗢𝗔𝗗𝗜𝗡𝗚 . . . ...\n👾🔥😈 𝗩𝗜𝗣 𝗠𝗢𝗗𝗘 𝗔𝗖𝗧𝗜𝗩𝗘𝗗 📩⚡\nTarget: {name}",
      offSuccess: "👾 𝗩𝗜𝗣 𝗠𝗢𝗗𝗘 𝗢𝗙𝗙 ⚡\nTarget: {name}",
      noMention: "👾 সিয়াম বস, আগে @mention দেন! তারপর ভাইরাল হবে 😈📩",
      notActive: "{name} এর জন্য bully mode অন ছিল না! 🤔"
    }
  },

  onStart: async function({ event, args, message, getLang, threadsData }) {
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
      return message.reply(getLang("noMention"));
    }

    let targetId = Object.keys(event.mentions)[0];
    let targetName = event.mentions[targetId];
    let data = await threadsData.get(event.threadID, "data.goatTargets", {});

    if (args[0]?.toLowerCase() === "off") {
      if (data[targetId]) {
        delete data[targetId];
        await threadsData.set(event.threadID, data, "data.goatTargets");
        return message.reply(getLang("offSuccess", { name: targetName }));
      } else {
        return message.reply(getLang("notActive", { name: targetName }));
      }
    }

    data[targetId] = true;
    await threadsData.set(event.threadID, data, "data.goatTargets");
    message.reply(getLang("setSuccess", { name: targetName }));
  },

  onChat: async function({ event, message, threadsData }) {
    let data = await threadsData.get(event.threadID, "data.goatTargets", {});
    if (!data || !data[event.senderID]) return;

    const bullyLines = [
      "😈 ভাই আজকে আপনার জন্য স্পেশাল রোস্ট মোড অন!",
      "👀 আপনার একটুকু মেসেজ—বটের আরেকটা রোস্ট 😎",
      "🔥 ভাই calm down, রোস্টেশন চলছে!",
      "😂 আপনি লেখলেই ভাইবস চালু হয়ে যায়!",
      "📩 ভাই, আপনার কারণে গ্রুপের এনার্জি বাড়ে!",
      "⚡ আপনি আসলেই ভিআইপি রোস্ট টার্গেট!"
    ];

    let randomLine = bullyLines[Math.floor(Math.random() * bullyLines.length)];
    message.reply(randomLine);
  }
};