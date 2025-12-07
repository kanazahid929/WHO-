const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelistthread",
    aliases: ["wlt", "wt"],
    version: "2.0",
    author: "NTKhang",
    countDown: 0,
    role: 2,
    description: { en: "Manage whitelist per thread" },
    category: "owner",
    guide: {
      en: 'add [UIDs] -> Add members to current thread whitelist\n' +
          'remove [UIDs] -> Remove members from current thread whitelist\n' +
          'list -> List all whitelisted members in this thread\n' +
          'mode <on/off> -> Global whitelist mode ON/OFF\n' +
          'mode noti <on/off> -> Notification for non-whitelisted users'
    }
  },

  langs: {
    en: {
      added: "✅ Added %1 member(s)\n%2",
      alreadyWLT: "⚠ Already whitelisted %1 member(s)\n%2",
      missingTIDAdd: "⚠ Please specify UID(s) or use no args to add all members",
      removed: "✅ Removed %1 member(s)\n%2",
      notAdded: "❌ Not in whitelist: %1 member(s)\n%2",
      listWLTs: "✨ Whitelisted members:\n%1",
      turnedOn: "✅ Global whitelist mode ENABLED",
      turnedOff: "❌ Global whitelist mode DISABLED",
      turnedOnNoti: "✅ Notification ON for non-whitelisted users",
      turnedOffNoti: "❎ Notification OFF for non-whitelisted users"
    }
  },

  noPrefix: true,

  onStart: async function({ message, args, event, getLang, api }) {
    if (!config.whiteListMode) config.whiteListMode = { enable: false, hideNotiMessage: false };
    if (!config.whiteListThreads) config.whiteListThreads = {};
    const threadID = event.threadID;
    if (!config.whiteListThreads[threadID]) config.whiteListThreads[threadID] = [];

    const cmd = args[0]?.toLowerCase();
    let uids = [];

    switch(cmd) {
      case "add":
      case "-a":
      case "+": {
        // যদি কোনো UID না দেওয়া হয়, গ্রুপের সব মেম্বার add করবে
        if (args.length <= 1) {
          const threadInfo = await api.getThreadInfo(threadID);
          uids = threadInfo.participantIDs || [];
        } else {
          uids = args.slice(1).filter(x => !isNaN(x));
        }

        if (!uids.length) return message.reply(getLang("missingTIDAdd"));

        const added = [];
        const already = [];

        for (const uid of uids) {
          if (!config.whiteListThreads[threadID].includes(uid)) added.push(uid);
          else already.push(uid);
        }

        config.whiteListThreads[threadID].push(...added);
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (added.length ? getLang("added", added.length, added.map(uid => `├‣ ${uid}`).join("\n")) : "") +
          (already.length ? getLang("alreadyWLT", already.length, already.map(uid => `├‣ ${uid}`).join("\n")) : "")
        );
      }

      case "remove":
      case "-r":
      case "-": {
        uids = args.slice(1).filter(x => !isNaN(x));
        if (!uids.length) uids = [...config.whiteListThreads[threadID]]; // remove all if no args

        const removed = [];
        const notFound = [];

        for (const uid of uids) {
          if (config.whiteListThreads[threadID].includes(uid)) {
            config.whiteListThreads[threadID] = config.whiteListThreads[threadID].filter(x => x !== uid);
            removed.push(uid);
          } else notFound.push(uid);
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (removed.length ? getLang("removed", removed.length, removed.map(uid => `├‣ ${uid}`).join("\n")) : "") +
          (notFound.length ? getLang("notAdded", notFound.length, notFound.map(uid => `├‣ ${uid}`).join("\n")) : "")
        );
      }

      case "list": {
        const list = config.whiteListThreads[threadID];
        return message.reply(getLang("listWLTs", list.map(uid => `├‣ ${uid}`).join("\n")));
      }

      case "mode":
      case "-m": {
        let isNoti = false;
        let value;
        let index = 1;
        if (args[1] === "noti") { isNoti = true; index = 2; }

        if (args[index] === "on") value = true;
        else if (args[index] === "off") value = false;
        else return message.reply("⚠ Invalid argument! Use on/off");

        if (isNoti) {
          config.whiteListMode.hideNotiMessage = !value;
          message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
        } else {
          config.whiteListMode.enable = value;
          message.reply(getLang(value ? "turnedOn" : "turnedOff"));
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        break;
      }

      default:
        return;
    }
  }
};
