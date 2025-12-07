const { writeFileSync, existsSync, readFileSync } = require("fs-extra");
const { config } = global.GoatBot;

module.exports = {
  config: {
    name: "wl",
    version: "1.2",
    author: "Rehat--",
    role: 0,
    longDescription: { en: "Global and group-specific whitelist" },
    category: "owner",
  },

  data: {
    globalWL: false,
    groups: {}
  },

  onStart: async function () {
    if (existsSync(`${__dirname}/wl_data.json`)) {
      this.data = JSON.parse(readFileSync(`${__dirname}/wl_data.json`, "utf-8"));
    }
  },

  saveData() {
    writeFileSync(`${__dirname}/wl_data.json`, JSON.stringify(this.data, null, 2));
  },

  onChat: async function ({ event, message, args, usersData }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    // Only bot owner can use
    if (!global.GoatBot.config.adminBot.includes(senderID)) return;

    // init group
    if (!this.data.groups[threadID]) this.data.groups[threadID] = { users: [] };
    const group = this.data.groups[threadID];

    if (!args[0]) return;

    switch (args[0].toLowerCase()) {

      // GLOBAL WL ON
      case "on":
        this.data.globalWL = true;
        this.saveData();
        return message.reply("✅ WL mode ENABLED for ALL groups");

      // GLOBAL WL OFF
      case "off":
        this.data.globalWL = false;
        this.saveData();
        return message.reply("❌ WL mode DISABLED for ALL groups");

      // ADD USER TO CURRENT GROUP
      case "add":
      case "-a": {
        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.slice(1).filter(x => !isNaN(x));

        const added = [];
        const already = [];

        for (const uid of uids) {
          if (!group.users.includes(uid)) {
            group.users.push(uid);
            added.push(uid);
          } else already.push(uid);
        }

        this.saveData();

        return message.reply(
          (added.length ? `✅ Added users in this group:\n${added.join("\n")}` : "") +
          (already.length ? `\n⚠ Already added:\n${already.join("\n")}` : "")
        );
      }

      // REMOVE USER FROM CURRENT GROUP
      case "remove":
      case "-r": {
        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.slice(1).filter(x => !isNaN(x));

        const removed = [];
        const notFound = [];

        for (const uid of uids) {
          if (group.users.includes(uid)) {
            group.users = group.users.filter(x => x !== uid);
            removed.push(uid);
          } else notFound.push(uid);
        }

        this.saveData();

        return message.reply(
          (removed.length ? `✅ Removed users from this group:\n${removed.join("\n")}` : "") +
          (notFound.length ? `\n⚠ Not found:\n${notFound.join("\n")}` : "")
        );
      }

      // LIST USERS IN CURRENT GROUP
      case "list":
      case "-l":
        return message.reply(
          `👑 WL users in this group:\n${group.users.join("\n") || "No users added"}`
        );

      default:
        return;
    }
  }
};
