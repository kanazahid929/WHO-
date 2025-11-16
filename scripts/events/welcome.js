const { getTime, drive } = global.utils;
const axios = require("axios");
const fs = require("fs");
const path = require("path");

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "2.1",
        author: "MD SIYAM OFFICIAL",
        category: "events"
    },

    langs: {  
        en: {  
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "🧸 চলে এসেছি ⚡🧸 আমি নায়ক মিলন তোমাদের মাঝে 👀📌\nWelcome to my group ⚡",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: `🫧🫧👀 {userName} আসসালামুয়ালাইকুম 💚👑\n\nআপনাকে স্বাগতম 🏴‍☠️☄️\n {multiple} আমাদের {boxName} গ্রুপে 💢👑🌪️\n\n👑গ্রুপে সবার সাথে মিলেমিশে☄️ থাকবেন এবং যে কোন প্রয়োজনে আমার বস সিয়াম ভাই কে নক করতে পারেন 💖⚡💢\n\n\n\n𝘽𝙊𝙏 𝘾𝙍𝙀𝘼𝙏𝙊𝙍 : 𝘾𝙀𝙊⚠️🏴‍☠️ 𝙎𝙄𝙔𝘼𝙈 👀⚠️👑`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {  
        if (event.logMessageType !== "log:subscribe") return;

        return async function () {  
            const hours = getTime("HH");
            const { threadID } = event;
            const prefix = global.utils.getPrefix(threadID);
            const added = event.logMessageData.addedParticipants;

            // >>>>>>>>>>> Bot Joined virus siyam <<<<<<<<<<
            if (added.some(p => p.userFbId == api.getCurrentUserID())) {

                // >>> Nic -siyam <<<
                const botName = "𝗘͜͡𝗥𝗢𝗢𝗥 🍷🌪️📨";
                try {
                    await api.changeNickname(botName, threadID, api.getCurrentUserID());
                } catch (err) {}

                // video download
                const videoPath = path.join(__dirname, "welcome.mp4");
                const url = "https://files.catbox.moe/vf4ueu.mp4";

                if (!fs.existsSync(videoPath)) {
                    const file = await axios.get(url, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, file.data);
                }

                return message.send({
                    body: getLang("welcomeMessage", prefix),
                    attachment: fs.createReadStream(videoPath)
                });
            }

            // >>>>>>>>>>> User Joined <<<<<<<<<<

            if (!global.temp.welcomeEvent[threadID])
                global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };

            global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...added);
            clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

            global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {

                const threadInfo = await threadsData.get(threadID);
                if (threadInfo.settings.sendWelcomeMessage === false) return;

                const newUsers = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                const banned = threadInfo.data.banned_ban || [];

                const names = [];
                const mentions = [];

                for (const u of newUsers) {
                    if (banned.some(b => b.id == u.userFbId)) continue;
                    names.push(u.fullName);
                    mentions.push({ tag: u.fullName, id: u.userFbId });
                }

                if (names.length === 0) return;

                let welcomeMsg = threadInfo.data.welcomeMessage || getLang("defaultWelcomeMessage");
                const multi = names.length > 1;

                welcomeMsg = welcomeMsg
                    .replace(/\{userName\}/g, names.join(", "))
                    .replace(/\{boxName\}|\{threadName\}/g, threadInfo.threadName)
                    .replace(/\{multiple\}/g, multi ? getLang("multiple2") : getLang("multiple1"))
                    .replace(/\{session\}/g,
                        hours <= 10 ? getLang("session1")
                        : hours <= 12 ? getLang("session2")
                        : hours <= 18 ? getLang("session3")
                        : getLang("session4"));

                const form = { body: welcomeMsg, mentions };

                // default video
                const videoPath = path.join(__dirname, "welcome.mp4");
                const url = "https://files.catbox.moe/yx8c5i.mp4";

                if (!fs.existsSync(videoPath)) {
                    const file = await axios.get(url, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, file.data);
                }

                form.attachment = fs.createReadStream(videoPath);

                message.send(form);
                delete global.temp.welcomeEvent[threadID];

            }, 1500);
        };
    }
};
