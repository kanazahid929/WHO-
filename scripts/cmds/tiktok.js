const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "tiktok",
        version: "1.1",
        author: "siyam",
        role: 0,
        countDown: 5,
        shortDescription: "Download TikTok videos",
        longDescription: "Auto download TikTok video (no watermark)",
        category: "media"
    },

    onStart: async function ({ message, args }) {
        const url = args[0];

        if (!url)
            return message.reply("⚠️ TikTok ভিডিওর লিংক দাও!\nExample: tiktok https://vm.tiktok.com/...");

        try {
            const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;

            const res = await axios.get(apiUrl);
            if (!res.data || !res.data.data) 
                return message.reply("❌ ভিডিও পাওয়া যায়নি! (Invalid Link)");

            const videoUrl = res.data.data.play; // no watermark
            const filePath = path.join(__dirname, "tt.mp4");

            const video = await axios.get(videoUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, video.data);

            await message.reply({
                body: "✅ ভিডিও ডাউনলোড শেষ!",
                attachment: fs.createReadStream(filePath)
            });

            fs.unlinkSync(filePath);

        } catch (err) {
            console.log(err);
            message.reply("❌ Error: 404 / API dead — নতুন API লাগবে");
        }
    }
};