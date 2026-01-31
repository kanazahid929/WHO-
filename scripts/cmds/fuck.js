const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "fuck",
    version: "3.1.1",
    author: "Mesbah Saxx",
    countDown: 5,
    role: 0,
    category: "img",
    guide: {
      en: "{pn} @mention"
    }
  },

  onLoad: async function () {
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const imgPath = path.join(dirMaterial, "fuckv3.png");

    if (!fs.existsSync(dirMaterial))
      fs.mkdirSync(dirMaterial, { recursive: true });

    if (!fs.existsSync(imgPath)) {
      const res = await axios.get("https://files.catbox.moe/z32436.jpg", { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, res.data);
    }
  },

  onStart: async function ({ event, api }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);

    if (!mention[0])
      return api.sendMessage("Please mention 1 person.", threadID, messageID);

    const one = senderID;
    const two = mention[0];

    const imgPath = await makeImage({ one, two });

    return api.sendMessage({ attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
  }
};

async function makeImage({ one, two }) {
  const root = path.join(__dirname, "cache", "canvas");

  const baseImg = await jimp.read(path.join(root, "fuckv3.png"));
  const outPath = path.join(root, `batman${one}_${two}.png`);

  const avatarOnePath = path.join(root, `avt_${one}.png`);
  const avatarTwoPath = path.join(root, `avt_${two}.png`);

  const avatarOne = (
    await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  const avatarTwo = (
    await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(avatarOnePath, avatarOne);
  fs.writeFileSync(avatarTwoPath, avatarTwo);

  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  baseImg.composite(circleOne.resize(100, 100), 20, 300).composite(circleTwo.resize(150, 150), 100, 20);

  await baseImg.writeAsync(outPath);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return outPath;
}

async function circle(imgPath) {
  const img = await jimp.read(imgPath);
  img.circle();
  return await img.getBufferAsync("image/png");
}
