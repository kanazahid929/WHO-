 const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "npx1",
        version: "2.1",
        author: "siyam883381",
        countDown: 5,
        role: 0,
        shortDescription: "auto reply video",
        longDescription: "Replies with video when exact words or emojis are sent",
        category: "reply",
    },

    onStart: async function () {},

    onChat: async function ({ event, message }) {
        if (!event.body) return;

        // Allowed triggers (exact match only)
        const triggers = ["🙂", "🥺", "😊", "💗", "😅", ""];

        const text = event.body.toLowerCase().trim();

        // EXCAT MATCH only
        const matched = triggers.includes(text);
        if (!matched) return;

        const videoURL = "https://files.catbox.moe/xr4eki.mp4";
        const fileName = path.basename(videoURL);
        const filePath = path.join(__dirname, fileName);

        try {
            const response = await axios.get(videoURL, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);

            await message.reply({
                body: 
`💖🥰\n\n___𝗢𝗻𝗰𝗲 𝗮 𝗽𝗲𝗿𝘀𝗼𝗻 𝗹𝗲𝗮𝗿𝗻𝘀 𝘁𝗼 𝗸𝗻𝗼𝘄 𝘁𝗵𝗮𝘁 𝘁𝗵𝗲 𝘀𝘄𝗲𝗲𝘁 𝗵𝗲𝗮𝗿𝘁 𝘄𝗶𝗹𝗹 𝗻𝗼𝘁 𝗴𝗼 𝘄𝗶𝘁𝗵 𝗮𝗻𝘆𝗼𝗻𝗲, 𝘁𝗵𝗲𝗻 𝗵𝗲 𝘄𝗶𝗹𝗹 𝘁𝗲𝗹𝗹 𝗵𝗶𝗺𝘀𝗲𝗹𝗳 𝘁𝗵𝗮𝘁 𝗶𝘁 𝗶𝘀 𝗯𝗲𝘀𝘁 𝘁𝗼 𝗯𝗲 𝗮𝗹𝗼𝗻𝗲.
___________________👑🥺`,
                attachment: fs.createReadStream(filePath)
            });

        } catch (error) {
            console.error("Error:", error.message);
            await message.reply("⚠️ not else retun to siyam api ....");
        }

        setTimeout(() => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, 5000);
    }
};
