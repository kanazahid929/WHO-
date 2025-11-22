const fs = require("fs");

module.exports = {
    config: {
        name: "npx8-sad",
        version: "1.0",
        author: "siyam7",
        countDown: 5,
        role: 0,
        description: {
            en: "Auto play audio when trigger emojis are detected"
        },
        category: "no prefix",
        guide: {
            en: "Only trigger emoji will send voice"
        }
    },

    onChat: async function ({ api, event }) {
        const { threadID, messageID, body } = event;
        if (!body) return;

        // Remove spaces
        const text = body.replace(/\s+/g, "");

        // Trigger emojis
        const triggers = ["🫠", "🥹", "🥺", "😺", "🌧️"];

        // Check if the message is exactly one of the trigger emojis
        if (triggers.includes(text)) {

            const filePath = __dirname + "/siyam/siyamend.mp3";

            api.sendMessage({
                body: "𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ✨🍥🌈\n\n🍭𝐂𝐄𝐎⸙𝐒𝐄𝐘𝐀𝐌𓆪🍥",
                attachment: fs.createReadStream(filePath)
            }, threadID, messageID);

            api.setMessageReaction("😭", messageID, () => {}, true);
        }
    },

    onStart: async function () {}
};
