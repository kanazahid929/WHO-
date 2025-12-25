const { getTime, drive } = global.utils;
const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* =========================
   🔥 EDIT ONLY THIS PART 🔥
   ========================= */

const leaveTemplateIndex = 1; // 1 / 2 / 3 যেটা চাইবে

const LEAVE_TEMPLATES = {
  1: `🚬━━━━━━━━━━━━━━━━🚬
👋 {userName} গ্রুপ থেকে চলে গেছে
🕒 সময়: {time}
📦 গ্রুপ: {threadName}
💭 কথা শেষ না হলেও যাওয়া লাগেই…
🚬━━━━━━━━━━━━━━━━🚬`,

  2: `🚬━━━━━━━━━━━━━━━━🚬
📤 {userName} আর আমাদের সাথে নেই
⏰ {time} | {session}
💬 {threadName}
🥀 কিছু মানুষ শুধু স্মৃতি হয়ে থাকে
🚬━━━━━━━━━━━━━━━━🚬`,

  3: `🚬━━━━━━━━━━━━━━━━🚬
⚠️ {userName} গ্রুপ ত্যাগ করেছে
🕰 {time}
📦 {threadName}
🫡 আবার দেখা হবে অন্য কোথাও
🚬━━━━━━━━━━━━━━━━🚬`
};

// 🎥 Leave Video
const LEAVE_VIDEO_URL = "https://files.catbox.moe/mtrnr9.mp4";

/* ========================= */

module.exports = {
  config: {
    name: "leave",
    version: "3.0",
    author: "SAIF + Siyam Edit",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData?.settings?.sendLeaveMessage) return;

    const { leftParticipantFbId } = event.logMessageData;
    if (leftParticipantFbId == api.getCurrentUserID()) return;

    const time = getTime("HH:mm:ss");
    const threadName = threadData.threadName || "Unknown Group";
    const userName = await usersData.getName(leftParticipantFbId);

    const session =
      time <= "10:00:00" ? "🌅 Morning" :
      time <= "12:00:00" ? "☀️ Noon" :
      time <= "18:00:00" ? "🌞 Evening" :
      "🌙 Night";

    let leaveMessage = LEAVE_TEMPLATES[leaveTemplateIndex]
      .replace(/\{userName\}/g, userName)
      .replace(/\{time\}/g, time)
      .replace(/\{threadName\}/g, threadName)
      .replace(/\{session\}/g, session);

    // 🔽 Download video
    const videoPath = path.join(__dirname, "leave.mp4");
    const writer = fs.createWriteStream(videoPath);

    const response = await axios({
      url: LEAVE_VIDEO_URL,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    writer.on("finish", async () => {
      message.send({
        body: leaveMessage,
        attachment: fs.createReadStream(videoPath)
      });
    });
  }
};
