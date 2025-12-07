const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelistthread",
    aliases: ["wlt", "wt"],
    version: "1.6",
    author: "NTKhang",
    countDown: 5,
    role: 2,
    description: {
      en: "Add, remove, edit whiteListThreadIds role"
    },
    category: "owner",
    guide: {
      en: '   {pn} [add | -a | +] [<tid>...]: Add whiteListThreadIds role for the current thread or specified thread IDs'
        + '\n   {pn} [remove | -r | -] [<tid>...]: Remove whiteListThreadIds role from the current thread or specified thread IDs'
        + '\n   {pn} [list | -l]: List all whiteListThreadIds'
        + '\n   {pn} [mode | -m] <on|off>: Turn on/off whiteListThreadIds mode'
        + '\n   {pn} [mode | -m] noti <on|off>: Turn on/off notification for non-whiteListThreadIds'
    }
  },

  langs: {
    en: {
      added: `\n╭─✦✅ | 𝙰𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
      alreadyWLT: `╭✦⚠️ | 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2\n`,
      missingTIDAdd: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 to add in whiteListThread role",
      removed: `\n╭✦✅ | 𝚁𝚎𝚖𝚘𝚟𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2`,
      notAdded: `╭✦❎ | 𝙳𝚒𝚍n't add %1 threads\n%2\n`,
      missingTIDRemove: "⚠️ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚃𝙸𝙳 to remove from whiteListThread role",
      listWLTs: `╭✦✨ | 𝙻𝚒𝚜𝚝 𝚘𝚏 𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝙳s\n%1\n╰‣ `,
      turnedOn: "✅ ❗Turned on-----𝗘͜͡𝗥𝗢𝗢𝗥 🍷🌪️\n\n❗____👀⚡",
      turnedOff: "🔔❗ Turned off..............⚡ 𝗩͟𝗜͟͠𝗥𝗨𝗦",
      turnedOnNoti: "✅ | Notification ON for non-whitelisted threads",
      turnedOffNoti: "❎ | Notification OFF for non-whitelisted threads"
    }
  },

  onStart: async function ({ message, args, event, getLang, api }) {
    // Initialize whiteListThread if undefined
    if (!config.whiteListModeThread) {
      config.whiteListModeThread = { enable: false, whiteListThreadIds: [] };
    }

    switch (args[0]?.toLowerCase()) {
      case "add":
      case "-a":
      case "+": {
        let tids = args.slice(1).filter(x => !isNaN(x));
        if (tids.length <= 0) tids.push(event.threadID);

        const notWLTIDs = [];
        const alreadyWLT = [];

        for (const tid of tids) {
          if (!config.whiteListModeThread.whiteListThreadIds.includes(tid)) notWLTIDs.push(tid);
          else alreadyWLT.push(tid);
        }

        config.whiteListModeThread.whiteListThreadIds.push(...notWLTIDs);

        const getNames = await Promise.all(tids.map(async tid => {
          const d = await api.getThreadInfo(tid).catch(() => ({}));
          return { tid, name: d.threadName || "Not found" };
        }));

        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (notWLTIDs.length > 0 ? getLang("added", notWLTIDs.length, getNames.filter(({ tid }) => notWLTIDs.includes(tid)).map(({ tid, name }) => `├‣ ${name} (${tid})`).join("\n")) : "") +
          (alreadyWLT.length > 0 ? getLang("alreadyWLT", alreadyWLT.length, alreadyWLT.map(tid => `├‣ ${tid}`).join("\n")) : "")
        );
      }

      case "remove":
      case "rm":
      case "-r":
      case "-": {
        let tids = args.slice(1).filter(x => !isNaN(x));
        if (tids.length <= 0) tids.push(event.threadID);

        const removed = [];
        const notAdded = [];

        for (const tid of tids) {
          if (config.whiteListModeThread.whiteListThreadIds.includes(tid)) {
            config.whiteListModeThread.whiteListThreadIds = config.whiteListModeThread.whiteListThreadIds.filter(x => x !== tid);
            removed.push(tid);
          } else notAdded.push(tid);
        }

        const getNames = await Promise.all(removed.map(async tid => {
          const d = await api.getThreadInfo(tid).catch(() => ({}));
          return { tid, name: d.threadName || "Not found" };
        }));

        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (removed.length ? getLang("removed", removed.length, getNames.map(({ tid, name }) => `├‣ ${name} (${tid})`).join("\n")) : "") +
          (notAdded.length ? getLang("notAdded", notAdded.length, notAdded.map(tid => `├‣ ${tid}`).join("\n")) : "")
        );
      }

      case "list":
      case "-l": {
        const getNames = await Promise.all(config.whiteListModeThread.whiteListThreadIds.map(async tid => {
          const t = await api.getThreadInfo(tid).catch(() => ({}));
          return { tid, name: t.threadName || "Not found" };
        }));
        return message.reply(getLang("listWLTs", getNames.map(({ tid, name }) => `├‣ ${name} (${tid})`).join("\n")));
      }

      case "mode":
      case "m":
      case "-m": {
        let isNoti = false;
        let value;
        let index = 1;

        if (args[1] === "noti") {
          isNoti = true;
          index = 2;
        }

        if (args[index] === "on") value = true;
        else if (args[index] === "off") value = false;
        else return message.reply("⚠️ Invalid argument! Use on/off");

        if (isNoti) {
          if (!config.hideNotiMessage) config.hideNotiMessage = {};
          config.hideNotiMessage.whiteListModeThread = !value;
          message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
        } else {
          config.whiteListModeThread.enable = value;
          message.reply(getLang(value ? "turnedOn" : "turnedOff"));
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        break;
      }

      default:
        return message.reply(getLang("missingTIDAdd"));
    }
  }
};
