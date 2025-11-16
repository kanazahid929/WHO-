const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.7",
        author: "NTKhang11 (Fixed by ChatGPT)",
        category: "events"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            welcomeMessage:
                "╭────────────◊\n\n🧸চলে এসেছি1 ⚡🧸আমি নায়ক মিলন তোমাদের মাঝে 👀📌🕸️\nকেমন আছো প্রিয় 𝘼͜͡𝘾͜͡𝙎🚩 WORLD 🕸️ ==𝗦𝗢𝗠𝗘𝗧𝗛𝗜𝗡𝗚 𝗘𝗟𝗦E\n\n যেকোনো প্রয়োজনে আমার বস সিয়াম ভাইকে নক দিতে পারেন ধন্যবাদ ❤️‍🩹 ⚡ ⚠️\n\n\n📌👀🕸️╰─────────",
            multiple1: "you",
            multiple2: "you guys",
            defaultWelcomeMessage:
                `সিয়াম ভায়ের পক্ষ থেকে1 🧸⚡ 👀📌 {userName}.\nWelcome {multiple} to the chat group: {boxName}\nHave a nice {session} 😊`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {

        // ❗ GoATBOT v2 FIX — return async function() removed
        if (event.logMessageType !== "log:subscribe") return;

        const hours = getTime("HH");
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;

        // 🟢 Bot added to group
        if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {

            if (nickNameBot)
                api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());

            return message.send({
                body: getLang("welcomeMessage", prefix),
                attachment: await global.utils.getStreamFromUrl(
                    "https://files.catbox.moe/yx8c5i.mp4",
                    { headers: { "User-Agent": "Mozilla/5.0 (GoatBot Welcome Module)" } }
                )
            });
        }

        // 🟢 Multiple join handling buffer
        if (!global.temp.welcomeEvent[threadID])
            global.temp.welcomeEvent[threadID] = {
                joinTimeout: null,
                dataAddedParticipants: []
            };

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
            const threadData = await threadsData.get(threadID);

            if (threadData.settings.sendWelcomeMessage == false)
                return;

            const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
            const dataBanned = threadData.data.banned_ban || [];
            const threadName = threadData.threadName;

            const userName = [], mentions = [];
            let multiple = dataAddedParticipants.length > 1;

            for (const user of dataAddedParticipants) {
                if (dataBanned.some(item => item.id == user.userFbId))
                    continue;

                userName.push(user.fullName);
                mentions.push({ tag: user.fullName, id: user.userFbId });
            }

            if (userName.length === 0) return;

            // 🟢 Welcome message text
            let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

            const form = {
                mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
            };

            welcomeMessage = welcomeMessage
                .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                .replace(/\{boxName\}|\{threadName\}/g, threadName)
                .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                .replace(/\{session\}/g,
                    hours <= 10
                        ? getLang("session1")
                        : hours <= 12
                            ? getLang("session2")
                            : hours <= 18
                                ? getLang("session3")
                                : getLang("session4")
                );

            form.body = welcomeMessage;

            // 🟢 Check custom attachments first
            if (threadData.data.welcomeAttachment) {
                const files = threadData.data.welcomeAttachment;
                const attachments = files.reduce((acc, file) => {
                    acc.push(drive.getFile(file, "stream"));
                    return acc;
                }, []);

                form.attachment = (await Promise.allSettled(attachments))
                    .filter(({ status }) => status === "fulfilled")
                    .map(({ value }) => value);
            } else {
                // Default video
                form.attachment = await global.utils.getStreamFromUrl(
                    "https://files.catbox.moe/yx8c5i.mp4",
                    { headers: { "User-Agent": "Mozilla/5.0 (GoatBot Welcome Module)" } }
                );
            }

            message.send(form);
            delete global.temp.welcomeEvent[threadID];

        }, 1500);
    }
};
