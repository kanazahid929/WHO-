const axios = require("axios");
const fs = require("fs");
const path = require("path");

const LEAVE_MESSAGE = `
📦 গ্রুপ: {threadName} থেকে🏴🦅
👤 ━━━━━━━━━━━━━━━━❗❗মিস্টার\n\n {userName} লিভ নিয়েছে 🏴 তবে সেটা বড় বিষয় না কারো জন্য গ্রুপ থেমে থাকে না তোমার জন্য এক বালতি সমবেদনা😑😎\n\n━━━━━━━━━━━━━━━━💀🚩
`;

const LEAVE_VIDEO_URL = "https://files.catbox.moe/mtrnr9.mp4";

module.exports = {
  config: {
    name: "leave",
    version: "3.1",
    author: "SAIF + Siyam Edit",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const threadData = await threadsData.get(event.threadID);
    if (!threadData?.settings?.sendLeaveMessage) return;

    const uid = event.logMessageData.leftParticipantFbId;
    if (uid == api.getCurrentUserID()) return;

    const userName = await usersData.getName(uid);
    const threadName = threadData.threadName || "Unknown Group";

    const body = LEAVE_MESSAGE
      .replace("{userName}", userName)
      .replace("{threadName}", threadName);

    // 🎥 download video
    const videoPath = path.join(__dirname, "leave.mp4");
    const writer = fs.createWriteStream(videoPath);

    const res = await axios({
      url: LEAVE_VIDEO_URL,
      method: "GET",
      responseType: "stream"
    });

    res.data.pipe(writer);

    writer.on("finish", () => {
      message.send({
        body,
        attachment: fs.createReadStream(videoPath)
      });
    });
  }
};
