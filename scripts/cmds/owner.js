const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    author: "Tokodori", // ok
    role: 0,
    shortDescription: "Show owner information",
    longDescription: "Displays information about the bot owner along with a video.",
    category: "admin",
    guide: "{pn}",
    usePrefix: false   // <<---- NO PREFIX ENABLED
  },

  onStart: async function ({ api, event }) {
    try {
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

      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

      const response = `
Name: ${ownerInfo.name}
Gender: ${ownerInfo.gender}
Nick: ${ownerInfo.nick}
`;

      api.sendMessage({
        body: response,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => {
        fs.unlinkSync(videoPath);
      });

    } catch (e) {
      api.sendMessage("Error fetching owner information or video.", event.threadID);
    }
  }
};
