const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelistthread",
    aliases: ["wlt", "wt"],
    version: "1.8",
    author: "NTKhang",
    countDown: 0,
    role: 2,
    description: { en: "Add, remove, edit whiteListThreadIds role" },
    category: "owner",
    guide: {
      en: 'add [<tid>...]: Add whitelist role for the current thread or specified thread IDs'
        + '\nremove [<tid>...]: Remove whitelist role from the current thread or specified thread IDs'
        + '\nlist: List all whitelist ThreadIDs'
        + '\nmode <on|off>: Turn on/off whitelist mode'
        + '\nmode noti <on|off>: Turn on/off notification for non-whitelisted threads'
    }
  },

  langs: {
    en: {
      added: `\n╭─✦✅ | Added %1 thread/s\n%2`,
      alreadyWLT: `╭✦⚠️ | Already added %1 thread/s\n%2\n`,
      missingTIDAdd: "⚠️ Please enter TID to add in whitelist",
      removed: `\n╭✦✅ | Removed %1 thread/s\n%2`,
      notAdded: `╭✦❎ | Didn't add %1 threads\n%2\n`,
      missingTIDRemove: "⚠️ Please enter TID to remove from whitelist",
      listWLTs: `╭✦✨ | List of ThreadIDs\n%1\n╰‣ `,
      turnedOn: "✅ | WHITELIST MODE ENABLED ✅",
      turnedOff: "❌ | WHITELIST MODE DISABLED ❌",
      turnedOnNoti: "✅ | Notification ON for non-whitelisted threads",
      turnedOffNoti: "❎ | Notification OFF for non-whitelisted threads"
    }
  },

  noPrefix: true,

  onStart: async function ({ message, args, event, getLang, api }) {
    if (!config.whiteListModeThread) config.whiteListModeThread = { enable: false, whiteListThreadIds: [] };

    const cmd = args[0]?.toLowerCase();  
    let tids;

    // Mode OFF হলে সব গ্রুপে কাজ করবে, check skip
    const isWhitelistActive = config.whiteListModeThread?.enable;

    // যদি mode on থাকে, কিন্তু current thread whitelist এ না থাকে, notification
    if (isWhitelistActive && !config.whiteListModeThread.whiteListThreadIds.includes(event.threadID)) {
      // notification যদি on থাকে দেখাবে, অন্যথায় skip
      if (!config.hideNotiMessage?.whiteListModeThread) {
        return message.reply("⚠️ You are not whitelisted!");
      }
    }

    switch (cmd) {
      case "add":
      case "-a":
      case "+": {
        tids = args.slice(1).filter(x => !isNaN(x));
        if (!tids.length) tids.push(event.threadID);

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

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (notWLTIDs.length > 0 ? getLang("added", notWLTIDs.length, getNames.filter(({ tid }) => notWLTIDs.includes(tid)).map(({ tid, name }) => `├‣ ${name} (${tid})`).join("\n")) : "") +
          (alreadyWLT.length > 0 ? getLang("alreadyWLT", alreadyWLT.length, alreadyWLT.map(tid => `├‣ ${tid}`).join("\n")) : "")
        );
      }

      case "remove":
      case "rm":
      case "-r":
      case "-": {
        tids = args.slice(1).filter(x => !isNaN(x));
        if (!tids.length) tids.push(event.threadID);

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

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

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

        if (args[1] === "noti") { isNoti = true; index = 2; }

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
