const { config } = global.GoatBot;

module.exports = {
  config: {
    name: "wl",
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    longDescription: {
      en: "Add, remove, edit whiteListIds"
    },
    category: "owner",
    guide: {
      en: '   {pn} [add | -a] <uid | @tag>: Add admin role for user' +
        '\n   {pn} [remove | -r] <uid | @tag>: Remove admin role of user' +
        '\n   {pn} [list | -l]: List all admins' +
        '\n   {pn} [ on | off ]: enable and disable whiteList mode'
    }
  },

  langs: {
    en: {
      added: "✅ | Added whiteList role for %1 users:\n%2",
      alreadyAdmin: "\n⚠ | %1 users already have whiteList role:\n%2",
      missingIdAdd: "⚠ | Please enter ID or tag user to add in whiteListIds",
      removed: "✅ | Removed whiteList role of %1 users:\n%2",
      notAdmin: "⚠ | %1 users don't have whiteListIds role:\n%2",
      missingIdRemove: "⚠ | Please enter ID or tag user to remove whiteListIds",
      listAdmin: "👑 | List of whiteListIds:\n%1",
      enable: "✅ Turned on-----𝗘͜͡𝗥𝗢𝗢𝗥 🍷🌪️\n\n____👀⚡",
      disable: "✅ Turned off..............⚡ 𝗩͟𝗜͟͠𝗥𝗨𝗦"
    }
  },

  onStart: async function ({ message, args, usersData, event, getLang, api }) {
    const { writeFileSync } = require("fs-extra");

    // ---------------- NO PREFIX ----------------
    const body = event.body?.toLowerCase().trim();
    const split = body.split(/\s+/);
    const cmd = split[0]; // add, remove, list, on, off
    args = split.slice(1);

    switch (cmd) {
      case "add":
      case "-a": {
        if (!args[0]) return message.reply(getLang("missingIdAdd"));
        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.filter(arg => !isNaN(arg));

        const notAdminIds = [];
        const adminIds = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) adminIds.push(uid);
          else notAdminIds.push(uid);
        }

        config.whiteListMode.whiteListIds.push(...notAdminIds);
        const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "") +
          (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
        );
      }

      case "remove":
      case "-r": {
        if (!args[0]) return message.reply(getLang("missingIdRemove"));
        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.filter(arg => !isNaN(arg));

        const notAdminIds = [];
        const adminIds = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) adminIds.push(uid);
          else notAdminIds.push(uid);
        }

        for (const uid of adminIds) config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);
        const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "") +
          (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
        );
      }

      case "list":
      case "-l": {
        const getNames = await Promise.all(config.whiteListMode.whiteListIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
        return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
      }

      case "on": {
        config.whiteListMode.enable = true;
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang("enable"));
      }

      case "off": {
        config.whiteListMode.enable = false;
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang("disable"));
      }

      default:
        return;
    }
  },

  // ------------------- NO PREFIX -------------------
  onChat: async function (props) {
    return this.onStart(props);
  }
};
