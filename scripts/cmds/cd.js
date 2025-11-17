const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "cd",
        version: "2.1",
        author: "siyam8881",
        countDown: 5,
        role: 2,
        shortDescription: "auto reply video",
        longDescription: "Replies with video when exact words or emojis are sent",
        category: "reply",
    },

    onStart: async function () {},

    onChat: async function ({ event, message }) {
        if (!event.body) return;

        // Allowed triggers (exact match only)
        const triggers = ["siyam", "😎", "👑", "⚠️", "🏴‍☠️", "☄️"];

        const text = event.body.toLowerCase().trim();

        // EXCAT MATCH only
        const matched = triggers.includes(text);
        if (!matched) return;

        const videoURL = "https://files.catbox.moe/vf4ueu.mp4";
        const fileName = path.basename(videoURL);
        const filePath = path.join(__dirname, fileName);

        try {
            const response = await axios.get(videoURL, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);

            await message.reply({
                body: 
`々𝗪͜͡𝗛𝗢☄️🏴‍☠️⚠️ 𝗜 𝗮𝗺 -?  🎭👑

𝗬𝗢𝗨 𝗛𝗔𝗩𝗘 𝗡𝗢 𝗜𝗗𝗘𝗔

𝗖𝗼𝗱𝗲 𝗥𝘂𝗹𝗲𝗿👀🌪️

___________________☠️⚡`,
                attachment: fs.createReadStream(filePath)
            });

        } catch (error) {
            console.error("Error:", error.message);
            await message.reply("⚠️ ভাই, ভিডিও লোড করতে সমস্যা হইছে!");
        }

        setTimeout(() => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 5000);
    }
};
