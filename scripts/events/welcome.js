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
        author: "𝐌𝐃 𝐒𝐈𝐘𝐀𝐌 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋",
        category: "events"
    },

    langs: {
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage: "🧸চলে এসেছি ⚡🧸আমি নায়ক মিলন তোমাদের মাঝে 👀📌\nWelcome to my group ⚡",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage: `সিয়াম ভাইয়ের পক্ষ থেকে {userName}.\nWelcome {multiple} to the chat group: {boxName}\nHave a nice {session} 😊\n— 𝐌𝐃 𝐒𝐈𝐘𝐀𝐌 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType !== "log:subscribe") return;

        return async function () {
            const hours = getTime("HH");
            const { threadID } = event;
            const prefix = global.utils.getPrefix(threadID);
            const dataAdded = event.logMessageData.addedParticipants;

            // ---------- AUTO NICKNAME SET ----------
            for (const user of dataAdded) {
                if (user.userFbId != api.getCurrentUserID()) {
                    api.changeNickname(
                        "『🐐 SIYAM BOT OFFICIAL 🐐』",
                        threadID,
                        user.userFbId,
                        () => {}
                    );
                }
            }

            // ---------- BOT JOINED ----------
            if (dataAdded.some(i => i.userFbId == api.getCurrentUserID())) {

                const videoPath = path.join(__dirname, "welcome.mp4");
                const url = "https://files.catbox.moe/yx8c5i.mp4";

                if (!fs.existsSync(videoPath)) {
                    const video = await axios.get(url, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, video.data);
                }

                return message.send({
                    body: getLang("welcomeMessage", prefix),
                    attachment: fs.createReadStream(videoPath)
                });
            }

            // ---------- USERS JOINED ----------
            if (!global.temp.welcomeEvent[threadID])
                global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };

            global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAdded);
            clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

            global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {

                const threadData = await threadsData.get(threadID);
                if (threadData.settings.sendWelcomeMessage === false) return;

                const addedUsers = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                const banned = threadData.data.banned_ban || [];

                const names = [];
                const mentions = [];

                for (const user of addedUsers) {
                    if (banned.some(b => b.id == user.userFbId)) continue;
                    names.push(user.fullName);
                    mentions.push({ tag: user.fullName, id: user.userFbId });
                }

                if (names.length === 0) return;

                let welcomeMessage = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");

                const multiple = names.length > 1;
                const threadName = threadData.threadName;

                welcomeMessage = welcomeMessage
                    .replace(/\{userName\}/g, names.join(", "))
                    .replace(/\{boxName\}|\{threadName\}/g, threadName)
                    .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                    .replace(/\{session\}/g,
                        hours <= 10 ? getLang("session1")
                        : hours <= 12 ? getLang("session2")
                        : hours <= 18 ? getLang("session3")
                        : getLang("session4")
                    );

                const form = {
                    body: welcomeMessage,
                    mentions: mentions
                };

                const videoPath = path.join(__dirname, "welcome.mp4");
                const url = "https://files.catbox.moe/yx8c5i.mp4";

                if (!fs.existsSync(videoPath)) {
                    const video = await axios.get(url, { responseType: "arraybuffer" });
                    fs.writeFileSync(videoPath, video.data);
                }

                form.attachment = fs.createReadStream(videoPath);

                message.send(form);
                delete global.temp.welcomeEvent[threadID];

            }, 1500);
        };
    }
};
