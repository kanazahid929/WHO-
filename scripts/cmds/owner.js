const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    author: "Tokodori", 
    role: 0,
    shortDescription: "Show owner information",
    longDescription: "Displays information about the bot owner along with a video.",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      // NO PREFIX trigger
      if (event.body?.toLowerCase() !== "owner") return;

      const ownerInfo = {
        name: '𓆩⟡ 👾𝗔𝗖𝗦 𝗦𝗜͜͡𝗬𝗔𝗠 𝗕𝗥𝗢 ⟡𓆪⚠️',
        gender: '𝐌𝐀𝐋𝐄👾🌪️',
        nick: '𝗟𝗘͜͡𝗔𝗗𝗘𝗥 𝗩𝗔͜͡𝗜 ⚠️🏴‍☠'
      };

      const videoUrl = 'https://drive.google.com/uc?export=download&id=1niWY1TqTsR26HQ5ZAQuPBuycNj3wzwBT';
      const tmpFolderPath = path.join(__dirname, 'tmp');

      if (!fs.existsSync(tmpFolderPath)) {
        fs.mkdirSync(tmpFolderPath);
      }

      const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

      const response = `
🌪️👾 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👾🌪️

⚠️ 𝗡𝗔𝗠𝗘: ${ownerInfo.name}\n\n
⚡ 𝗚𝗘𝗡𝗗𝗘𝗥: ${ownerInfo.gender}\n\n
🏴‍☠ 𝗡𝗜𝗖𝗞: ${ownerInfo.nick}

`;

      await api.sendMessage(
        {
          body: response,
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        event.messageID
      );

      api.setMessageReaction("🔥", event.messageID, () => {}, true);

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Something went wrong!", event.threadID);
    }
  }
};
