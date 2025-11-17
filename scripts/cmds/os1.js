const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "os1",
        version: "2.0",
        author: "siyam8881",
        countDown: 5,
        role: 2,
        shortDescription: "auto reply video",
        longDescription: "Replies with video when certain words or emojis are sent",
        category: "reply",
    },

    onStart: async function () {},

    onChat: async function ({ event, message }) {
        if (!event.body) return;

        // All triggers here
        const triggers = ["siyam", "😎", "👑", "⚠️", "🏴‍☠️", "os"];

        const text = event.body.toLowerCase();

        // Check if message contains any trigger
        const matched = triggers.some(t => text.includes(t.toLowerCase()));
        if (!matched) return;

        const videoURL = "https://files.catbox.moe/vf4ueu.mp4";
        const fileName = path.basename(videoURL);
        const filePath = path.join(__dirname, fileName);

        try {
            // Download video
            const response = await axios.get(videoURL, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);

            await message.reply({
                body: 
`々𝗪͜͡𝗛𝗢☄️🏴‍☠️⚠️ 𝗜 𝗮𝗺 -?  🎭👑\n\n\n𝗬𝗢𝗨 𝗛𝗔𝗩𝗘 𝗡𝗢 𝗜𝗗𝗘𝗔\n\n𝗖𝗼𝗱𝗲 𝗥𝘂𝗹𝗲𝗿👀🌪️\n\n
‎___________________☠️⚡`,
                attachment: fs.createReadStream(filePath)
            });

        } catch (error) {
            console.error("Error:", error.message);
            await message.reply("⚠️ ভাই, ভিডিও লোড করতে সমস্যা হইছে!");
        }

        // Delete temp file
        setTimeout(() => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 5000);
    }
};
