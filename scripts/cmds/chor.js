const fs = require("fs-extra");
const Canvas = require("canvas");
const jimp = require("jimp");
const request = require("node-superfetch");

module.exports = {
  config: {
    name: "chor",
    version: "1.0.1",
    author: "siyam",
    countDown: 5,
    role: 0,
    description: {
      en: "Scooby Doo meme"
    },
    category: "Picture",
    guide: {
      en: "{pn} @tag"
    }
  },

  circle: async function (image) {
    let img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
  },

  onStart: async function ({ api, event }) {
    try {
      const id = Object.keys(event.mentions)[0] || event.senderID;
      const out = __dirname + "/cache/chor.png";

      const canvas = Canvas.createCanvas(500, 670);
      const ctx = canvas.getContext("2d");

      const bg = await Canvas.loadImage("https://i.imgur.com/ES28alv.png");

      const avatarReq = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);

      const avatar = await this.circle(avatarReq.body);

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(await Canvas.loadImage(avatar), 48, 410, 111, 111);

      fs.writeFileSync(out, canvas.toBuffer());

      api.sendMessage({
        body: "মুরগী'র ডিম চুরি করতে গিয়ে ধরা খাই'ছে🐣😂\n\n ভাগবি কোথায় সিয়াম বস একজন সিআইডি অফিসার 😎💥💢",
        attachment: fs.createReadStream(out)
      }, event.threadID, () => fs.unlinkSync(out), event.messageID);

    } catch (e) {
      api.sendMessage(String(e), event.threadID);
    }
  }
};
