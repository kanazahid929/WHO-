const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "tiktok",
        aliases: ["tt", "ttdl"],
        version: "1.0",
        author: "siyam",
        role: 0,
        countDown: 5,
        shortDescription: "Download TikTok video",
        longDescription: "Download videos from TikTok using stable API",
        category: "media"
    },

    onStart: async function ({ message, args }) {
        const url = args[0];

        if (!url)
            return message.reply("⚠️ TikTok ভিডিওর লিংক দাও\nExample: tiktok https://vm.tiktok.com/...");

        try {
            const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
            const res = await axios.get(apiUrl);

            if (!res.data || !res.data.data)
                return message.reply("❌ ভিডিও পাওয়া যায়নি!");

            const videoUrl = res.data.data.play; // no watermark

            const filePath = path.join(__dirname, "tiktok.mp4");
            const video = await axios.get(videoUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, video.data);

            await message.reply({
                body: "✅ TikTok ভিডিও ডাউনলোড সম্পন্ন!",
                attachment: fs.createReadStream(filePath)
            });

            fs.unlinkSync(filePath);

        } catch (err) {
            console.log(err);
            return message.reply("❌ Error: ভিডিও ডাউনলোড করা যায়নি (API সমস্যা)");
        }
    }
};