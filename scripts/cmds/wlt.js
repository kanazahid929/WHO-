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
      en: '   add [<tid>...]: Add whiteListThreadIds role for the current thread or specified thread IDs'
        + '\n   remove [<tid>...]: Remove whiteListThreadIds role from the current thread or specified thread IDs'
        + '\n   list: List all whiteListThreadIds'
        + '\n   mode <on|off>: Turn on/off WhiteList mode'
        + '\n   mode noti <on|off>: Turn on/off notification for non-whitelisted threads'
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

  // **No prefix mode**
  noPrefix: true,

  onStart: async function({ message, args, event, getLang, api }) {
    // কেবল bot owner/admin use করতে পারবে
    if (!global.GoatBot.config.adminBot.includes(event.senderID)) return;

    // whiteListThread structure init
    if (!config.whiteListModeThread) config.whiteListModeThread = { enable: false, whiteListThreadIds: [] };

    // message text থেকে command এবং args বের করা
    const msg = event.body?.trim();
    if (!msg) return;

    const splitMsg = msg.split(/\s+/);
    const cmd = splitMsg[0].toLowerCase();
    const cmdArgs = splitMsg.slice(1);

    let tids;

    switch(cmd) {
      case "add":
        tids = cmdArgs.filter(x => !isNaN(x));
        if (!tids.length) tids.push(event.threadID);

        const added = [];
        const already = [];
        for (const tid of tids) {
          if (!config.whiteListModeThread.whiteListThreadIds.includes(tid)) added.push(tid);
          else already.push(tid);
        }
        config.whiteListModeThread.whiteListThreadIds.push(...added);

        const addedNames = await Promise.all(tids.map(async tid => {
          const d = await api.getThreadInfo(tid).catch(() => ({}));
          return { tid, name: d.threadName || "Not found" };
        }));

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (added.length ? getLang("added", added.length, addedNames.filter(n => added.includes(n.tid)).map(n => `├‣ ${n.name} (${n.tid})`).join("\n")) : "") +
          (already.length ? getLang("alreadyWLT", already.length, already.map(tid => `├‣ ${tid}`).join("\n")) : "")
        );

      case "remove":
        tids = cmdArgs.filter(x => !isNaN(x));
        if (!tids.length) tids.push(event.threadID);

        const removed = [];
        const notFound = [];
        for (const tid of tids) {
          if (config.whiteListModeThread.whiteListThreadIds.includes(tid)) {
            config.whiteListModeThread.whiteListThreadIds = config.whiteListModeThread.whiteListThreadIds.filter(x => x !== tid);
            removed.push(tid);
          } else notFound.push(tid);
        }

        const removedNames = await Promise.all(removed.map(async tid => {
          const d = await api.getThreadInfo(tid).catch(() => ({}));
          return { tid, name: d.threadName || "Not found" };
        }));

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (removed.length ? getLang("removed", removed.length, removedNames.map(n => `├‣ ${n.name} (${n.tid})`).join("\n")) : "") +
          (notFound.length ? getLang("notAdded", notFound.length, notFound.map(tid => `├‣ ${tid}`).join("\n")) : "")
        );

      case "list":
        const names = await Promise.all(config.whiteListModeThread.whiteListThreadIds.map(async tid => {
          const t = await api.getThreadInfo(tid).catch(() => ({}));
          return { tid, name: t.threadName || "Not found" };
        }));
        return message.reply(getLang("listWLTs", names.map(n => `├‣ ${n.name} (${n.tid})`).join("\n")));

      case "mode":
        let isNoti = false;
        let value;
        let index = 1;

        if (cmdArgs[0] === "noti") { isNoti = true; index = 1; }

        if (cmdArgs[index] === "on") value = true;
        else if (cmdArgs[index] === "off") value = false;
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

      default:
        return; // prefix ছাড়া unknown message ignore হবে
    }
  }
};
