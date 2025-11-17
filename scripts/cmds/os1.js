‎const axios = require("axios");
‎const fs = require("fs");
‎const path = require("path");
‎
‎module.exports = {
‎    config: {
‎        name: "os1",
‎        version: "3.0",
‎        author: "siyam8881",
‎        countDown: 5,
‎        role: 0,
‎        shortDescription: "auto reply + auto react",
‎        longDescription: "Triggers video + reaction when user sends certain words/emojis",
‎        category: "reply",
‎    },
‎
‎    onStart: async function () {},
‎
‎    onChat: async function ({ event, message, api }) {
‎        if (!event.body) return;
‎
‎        // Trigger list
‎        const triggers = ["siyam", "😎", "👑", "⚠️", "🏴‍☠️", "os"];
‎        const text = event.body.toLowerCase();
‎
‎        // Check if message contains trigger
‎        const matched = triggers.some(t => text.includes(t.toLowerCase()));
‎        if (!matched) return;
‎
‎        // AUTO REACTION 😎
‎        try {
‎            api.setMessageReaction("🚩", event.messageID, () => {}, true);
‎        } catch (e) {
‎            console.log("Reaction Error:", e.message);
‎        }
‎
‎        // Video download
‎        const videoURL = "https://files.catbox.moe/vf4ueu.mp4";
‎        const fileName = path.basename(videoURL);
‎        const filePath = path.join(__dirname, fileName);
‎
‎        try {
‎            const res = await axios.get(videoURL, { responseType: "arraybuffer" });
‎            fs.writeFileSync(filePath, res.data);
‎
‎            await message.reply({
‎                body:
‎`々𝗪͜͡𝗛𝗢☄️🏴‍☠️⚠️ 𝗜 𝗮𝗺 -?  🎭👑\n\n\n𝗬𝗢𝗨 𝗛𝗔𝗩𝗘 𝗡𝗢 𝗜𝗗𝗘𝗔\n\n𝗖𝗼𝗱𝗲 𝗥𝘂𝗹𝗲𝗿👀🌪️\n\n
‎___________________☠️⚡`,
‎                attachment: fs.createReadStream(filePath)
‎            });
‎
‎        } catch (error) {
‎            console.log("Video error:", error.message);
‎            await message.reply("⚠️𝙎𝙊𝙈𝙀𝙏𝙃𝙄𝙉𝙂 𝙀𝙇𝙎𝙀 // ⚠️🏴‍☠️ 𝙎𝙄𝙔𝘼𝙈 𝟘𝟘𝟠𝟟🌪️👑");
‎        }
‎
‎        // Cleanup
‎        setTimeout(() => {
‎            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
‎        }, 5000);
‎    }
‎};
