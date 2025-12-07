const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelistthread",
    aliases: ["wlt","wt"],
    version: "1.8",
    author: "NTKhang",
    countDown: 0,
    role: 2,
    description: { en: "Add, remove, edit whiteListThreadIds role" },
    category: "owner",
    guide: {
      en: 'add [<tid>...]: Add whitelist for current/specified threads\n'+
          'remove [<tid>...]: Remove whitelist\n'+
          'list: List all whitelist threads\n'+
          'mode <on|off>: Turn whitelist mode on/off\n'+
          'mode noti <on|off>: Notification for non-whitelisted threads'
    }
  },

  langs: {
    en: {
      added: "✅ Added %1 threads:\n%2",
      alreadyWLT: "⚠ Already added %1 threads:\n%2",
      missingTIDAdd: "⚠ Please enter thread ID to add",
      removed: "✅ Removed %1 threads:\n%2",
      notAdded: "❎ Didn't remove %1 threads:\n%2",
      missingTIDRemove: "⚠ Please enter thread ID to remove",
      listWLTs: "✨ List of whitelisted threads:\n%1",
      turnedOn: "✅ WHITELIST MODE ENABLED",
      turnedOff: "❌ WHITELIST MODE DISABLED",
      turnedOnNoti: "✅ Notification ON for non-whitelisted threads",
      turnedOffNoti: "❎ Notification OFF for non-whitelisted threads"
    }
  },

  noPrefix: true, // Enable no-prefix command

  // only init config on bot start
  onStart: async function() {
    if(!config.whiteListModeThread) config.whiteListModeThread = { enable:false, whiteListThreadIds:[] };
  },

  // handle commands
  onChat: async function({ message, args, event, api, getLang }) {
    if(!args[0]) return;
    const cmd = args[0].toLowerCase();

    if(!config.whiteListModeThread) config.whiteListModeThread = { enable:false, whiteListThreadIds:[] };

    let tids;
    switch(cmd) {
      case "add":
        tids = args.slice(1).filter(x=>!isNaN(x));
        if(!tids.length) tids.push(event.threadID);
        const added = [];
        const already = [];
        for(const tid of tids){
          if(!config.whiteListModeThread.whiteListThreadIds.includes(tid)) added.push(tid);
          else already.push(tid);
        }
        config.whiteListModeThread.whiteListThreadIds.push(...added);
        const addedNames = await Promise.all(added.map(async tid=> {
          const d = await api.getThreadInfo(tid).catch(()=>({}));
          return `${d.threadName||"Not found"} (${tid})`;
        }));
        writeFileSync(client.dirConfig, JSON.stringify(config,null,2));
        return message.reply(
          (added.length ? getLang("added",added.length,addedNames.join("\n")):"")+
          (already.length ? getLang("alreadyWLT",already.length,already.join("\n")):"")
        );

      case "remove":
        tids = args.slice(1).filter(x=>!isNaN(x));
        if(!tids.length) tids.push(event.threadID);
        const removed = [];
        const notFound = [];
        for(const tid of tids){
          if(config.whiteListModeThread.whiteListThreadIds.includes(tid)){
            config.whiteListModeThread.whiteListThreadIds = config.whiteListModeThread.whiteListThreadIds.filter(x=>x!==tid);
            removed.push(tid);
          } else notFound.push(tid);
        }
        const removedNames = await Promise.all(removed.map(async tid=>{
          const d = await api.getThreadInfo(tid).catch(()=>({}));
          return `${d.threadName||"Not found"} (${tid})`;
        }));
        writeFileSync(client.dirConfig, JSON.stringify(config,null,2));
        return message.reply(
          (removed.length ? getLang("removed",removed.length,removedNames.join("\n")):"")+
          (notFound.length ? getLang("notAdded",notFound.length,notFound.join("\n")):"")
        );

      case "list":
        const names = await Promise.all(config.whiteListModeThread.whiteListThreadIds.map(async tid=>{
          const d = await api.getThreadInfo(tid).catch(()=>({}));
          return `${d.threadName||"Not found"} (${tid})`;
        }));
        return message.reply(getLang("listWLTs",names.join("\n")));

      case "mode":
        let isNoti=false;
        let value;
        let index=1;
        if(args[1]==="noti"){ isNoti=true; index=2; }
        if(args[index]==="on") value=true;
        else if(args[index]==="off") value=false;
        else return message.reply("⚠ Invalid argument! Use on/off");
        if(isNoti){
          if(!config.hideNotiMessage) config.hideNotiMessage={};
          config.hideNotiMessage.whiteListModeThread = !value;
          message.reply(getLang(value?"turnedOnNoti":"turnedOffNoti"));
        } else {
          config.whiteListModeThread.enable=value;
          message.reply(getLang(value?"turnedOn":"turnedOff"));
        }
        writeFileSync(client.dirConfig,JSON.stringify(config,null,2));
        break;

      default:
        return message.reply(getLang("missingTIDAdd"));
    }
  }
};
