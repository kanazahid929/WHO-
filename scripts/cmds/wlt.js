const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
config: {
name: "whitelistthread",
aliases: ["wlt", "wt"],
version: "1.7",
author: "NTKhang",
countDown: 0,
role: 2,
description: { en: "Add, remove, edit whiteListThreadIds role" },
category: "owner",
guide: {
en: '   add [<tid>...]: Add whiteListThreadIds role for the current thread or specified thread IDs'

'\n   remove [<tid>...]: Remove whiteListThreadIds role from the current thread or specified thread IDs'

'\n   list: List all whiteListThreadIds'

'\n   mode <on|off>: Turn on/off whiteListThreadIds mode'

'\n   mode noti <on|off>: Turn on/off notification for non-whiteListThreadIds'
}
},


langs: {
en: {
added: \n╭─✦✅ | 𝙰𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2,
alreadyWLT: ╭✦⚠️ | 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚊𝚍𝚍𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2\n,
missingTIDAdd: "⚠️ Please enter TID to add in whitelist",
removed: \n╭✦✅ | 𝚁𝚎𝚖𝚘𝚟𝚎𝚍 %1 𝚝𝚑𝚛𝚎𝚊𝚍/𝚜\n%2,
notAdded: ╭✦❎ | Didn't add %1 threads\n%2\n,
missingTIDRemove: "⚠️ Please enter TID to remove from whitelist",
listWLTs: ╭✦✨ | List of ThreadIDs\n%1\n╰‣ ,
turnedOn: "✅ ❗Turned on-----𝗘͜͡𝗥𝗢𝗢𝗥 🍷🌪️\n\n❗____👀⚡",
turnedOff: "🔔❗ Turned off..............⚡ 𝗩͟𝗜͟͠𝗥𝗨𝗦",
turnedOnNoti: "✅ | Notification ON for non-whitelisted threads",
turnedOffNoti: "❎ | Notification OFF for non-whitelisted threads"
}
},

// Enable no-prefix mode
noPrefix: true,

onStart: async function ({ message, args, event, getLang, api }) {
if (!config.whiteListModeThread) config.whiteListModeThread = { enable: false, whiteListThreadIds: [] };

const cmd = args[0]?.toLowerCase();
let tids;

switch (cmd) {
case "add":
tids = args.slice(1).filter(x => !isNaN(x));
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
tids = args.slice(1).filter(x => !isNaN(x));
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
return message.reply(getLang("listWLTs", names.map(n => ├‣ ${n.name} (${n.tid})).join("\n")));

case "mode":
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

default:
return message.reply(getLang("missingTIDAdd"));
}

}
};
