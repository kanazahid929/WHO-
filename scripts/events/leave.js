const { getTime } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "2.5",
    author: "SAIF (Image Fix by Siyam)",
    category: "events"
  },

  langs: {
    en: {
      session1: "🌅 MORNING",
      session2: "☀️ AFTERNOON",
      session3: "🌞 AFTERNOON",
      session4: "🌙 NIGHT",
      leaveType1: "✨ JUST LEFT",
      leaveType2: "⚡ KICKED BY ADMIN",
      defaultLeaveMessage:
`📤 Oooops! {userName} {type} ❗
💌 Hope you enjoyed your time 😿
🕰 Time: {time} — Have a beautiful {session} 🌟
💬 Group: {threadName}
🌿 Never sad, another person will come 🫡
🥀 Bye {userName}, thanks for being a part of us! 💫`
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { leftParticipantFbId } = event.logMessageData;

    // ❌ ignore bot leave
    if (leftParticipantFbId == api.getCurrentUserID()) return;

    // ❌ ignore kick → only self leave
    if (leftParticipantFbId !== event.author) return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData?.settings?.sendLeaveMessage) return;

    const hour = parseInt(getTime("HH"));
    const timeNow = getTime("HH:mm:ss");
    const threadName = threadData.threadName;
    const userName = await usersData.getName(leftParticipantFbId);

    let leaveMessage = threadData.data.leaveMessage || getLang("defaultLeaveMessage");

    leaveMessage = leaveMessage
      .replace(/\{userName\}/g, userName)
      .replace(/\{type\}/g, getLang("leaveType1"))
      .replace(/\{threadName\}/g, threadName)
      .replace(/\{time\}/g, timeNow)
      .replace(/\{session\}/g,
        hour < 11 ? getLang("session1") :
        hour < 13 ? getLang("session2") :
        hour < 18 ? getLang("session3") :
        getLang("session4")
      );

    // Send MSG + IMAGE
    message.send({
      body: leaveMessage,
      attachment: ["https://files.catbox.moe/mfv9h2.jpg"]
    });
  }
};
