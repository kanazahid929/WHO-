const { getTime } = global.utils;
const axios = require("axios");
const fs = require("fs");
const path = require("path");

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "3.0",
        author: "MD SIYAM OFFICIAL",
        category: "events"
    },

    langs: {  
        en: {  
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "‎𝘽𝙊𝙏 𝘾𝙊𝙉𝙉𝙀𝘾𝙏𝙀𝘿 𝙎𝙐𝘾𝘾𝙀𝙎𝙎𝙁𝙐𝙇𝙇🏴‍☠️📌\n\n𝗟𝗢𝗔𝗗𝗜𝗡𝗚 . . . ...👾🔥😈 /// 𝗔͟𝗖͟͠𝗧𝗜͟͠𝗩𝗘𝗗📨💀⚡▓▓▓▓▓░░░░░ 99% .......\n  ╭────────────◊\n\n🧸—͟͞͞★চলে এসেছি ⚡🧸 তোমাদের মাঝে 👀📌🕸️\nকেমন আছো প্রিয় 🏴‍☠️☄️\n\n—͟͞͞★—͟͞͞★𝑩𝑫 𝑨𝑻𝑻𝑨𝑪𝑲 𝑪𝒀𝑩𝑬𝑹 𝑨𝑹𝑴𝒀—͟͞͞★যেকোনোপ্রয়োজনে আমার prince ভাইকে নক দিতে পারেন ধন্যবাদ ❤️‍🩹 ⚡ ⚠️\n\n\n📌👀𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸. . . ...https://www.facebook.com/profile.php?id=61576321289131&mibextid=ZbWKwL🕸️╰─────────◊",
            defaultWelcomeMessage: `🫧🫧👀 প্রিয় 🫵💗👀\n╭•┄┅════❁🌺❁════┅┄•╮ {userName} \n\n\n╰•┄┅════❁🌺❁════┅┄•╯\nআসসালামুয়ালাইকুম 💚👑\n\nআপনাকে স্বাগতম 🏴‍☠️☄️\n {multiple} আমাদের {boxName} গ্রুপে 💢👑🌪️\n\n👑গ্রুপে সবার সাথে মিলেমিশে☄️ থাকবেন এবং যে কোন প্রয়োজনে আমার বস সিয়াম ভাই কে নক করতে পারেন 💖⚡💢\n\n\n\n𝘽𝙊𝙏 𝘾𝙍𝙀𝘼𝙏𝙊𝙍 : 𝘾𝙀𝙊⚠️🏴‍☠️  👀⚠️👑`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {  
        if (event.logMessageType !== "log:subscribe") return;

        return async function () {  
            const { threadID } = event;
            const added = event.logMessageData.addedParticipants;

            // 🔥 BOT ADD হলে
            if (added.some(p => p.userFbId == api.getCurrentUserID())) {

                // ✅ AUTO NICKNAME সেট করা
                api.changeNickname(" -𝙨𝙞𝙡𝙚𝙣𝙩 𝙢𝙖𝙛𝙞𝙮𝙖______//😒🥺😈", threadID, api.getCurrentUserID());

                // ▶ Bot Add Video
                const botAddVideo = "https://files.catbox.moe/csq53a.mp4";
                const videoPath = path.join(__dirname, "bot_add.mp4");

                if (!fs.existsSync(videoPath)) {
                    const file = await axios.get(botAddVideo, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, file.data);
                }

                return message.send({
                    body: getLang("welcomeMessage"),
                    attachment: fs.createReadStream(videoPath)
                });
            }

            // 🔥 MEMBER ADD হলে
            if (!global.temp.welcomeEvent[threadID])
                global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };

            global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...added);
            clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

            global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {

                const threadInfo = await threadsData.get(threadID);
                if (threadInfo.settings.sendWelcomeMessage === false) return;

                const newUsers = global.temp.welcomeEvent[threadID].dataAddedParticipants;

                const names = [];
                const mentions = [];

                for (const u of newUsers) {
                    names.push(u.fullName);
                    mentions.push({ tag: u.fullName, id: u.userFbId });
                }

                if (names.length === 0) return;

                let welcomeMsg = threadInfo.data.welcomeMessage || getLang("defaultWelcomeMessage");
                const multi = names.length > 1;

                welcomeMsg = welcomeMsg
                    .replace(/\{userName\}/g, names.join(", "))
                    .replace(/\{boxName\}|\{threadName\}/g, threadInfo.threadName)
                    .replace(/\{multiple\}/g, multi ? "আপনারা" : "আপনি");

                // ▶ Member Add Video
                const memberVideo = "https://files.catbox.moe/eg0mcv.mp4";
                const videoPath = path.join(__dirname, "member_add.mp4");

                if (!fs.existsSync(videoPath)) {
                    const file = await axios.get(memberVideo, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, file.data);
                }

                message.send({
                    body: welcomeMsg,
                    attachment: fs.createReadStream(videoPath),
                    mentions
                });

                delete global.temp.welcomeEvent[threadID];

            }, 1500);
        };
    }
};
