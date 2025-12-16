 const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "as", // 🔥 FIXED (file name match)
    aliases: ["anistatus"],
    version: "1.1",
    author: "Kshitiz + Fixed by Siyam",
    role: 0,
    countDown: 5,
    category: "media",
    shortDescription: "Anime status video",
    noPrefix: true
  },

  // ✅ REQUIRED
  onStart: async function () {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
  },

  onChat: async function ({ api, event }) {
    if (!event.body) return;

    const text = event.body.toLowerCase().trim();

    // ✅ Only trigger on as / anistatus
    if (text !== "as" && text !== "anistatus") return;

    try {
      api.setMessageReaction("🪄", event.messageID, () => {}, true);

      const apiUrl = "https://ani-status.vercel.app/kshitiz";
      const response = await axios.get(apiUrl);

      if (!response.data?.url) {
        return api.sendMessage(
          "ELse to SIYAM virus 0098 return !!!.......444☠️",
          event.threadID
        );
      }

      const tikTokUrl = response.data.url;
      const downloadApi =
        `https://tikdl-video.vercel.app/tiktok?url=${encodeURIComponent(tikTokUrl)}`;

      const videoRes = await axios.get(downloadApi);

      if (!videoRes.data?.videoUrl) {
        return api.sendMessage(
          "❌ Video download করতে সমস্যা হচ্ছে",
          event.threadID
        );
      }

      const filePath = path.join(
        __dirname,
        "cache",
        `${Date.now()}.mp4`
      );

      await downloadVideo(videoRes.data.videoUrl, filePath);

      if (!fs.existsSync(filePath)) {
        return api.sendMessage(
          "❌ Video save return siyam api",
          event.threadID
        );
      }

      await api.sendMessage(
        {
          body: `=== 🪄「-(✷‿✷)」 ===❕✨💫

╭•┄┅════❁🌺❁════┅┄•╮
   - 𝐅𝐄𝐄𝐋 𝐓𝐇𝐈𝐒 𝐕𝐈𝐃𝐄𝐎 🪄🕯️
✢━━━━━━━━━━━━━━━✢༉༎🧸
╰•┄┅════❁🌺❁════┅┄•╯ 

╭•┄┅════❁🌺❁════┅┄•╮
         𝐂𝐑𝐄𝐀𝐓𝐎𝐑 ❗☠️
✢━━━━━━━━━━━━━━━✢🪄
༊_۵༎-𝐂-𝐄-𝐎 🩷⃝✨ [𝐒𝐄𝐘𝐀𝐌] 🌼
✢━━━━━━━━━━━━━━━✢`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        event.messageID
      );

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ Something went wrong", event.threadID);
    }
  }
};

// 🔹 Helper
async function downloadVideo(url, filePath) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, res.data);
          }
