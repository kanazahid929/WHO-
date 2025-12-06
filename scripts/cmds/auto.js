const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "auto",
    version: "2.0.3",
    role: 0,
    author: "siyam virus",
    description: "AutoTime with per-group on/off",
    category: "autotime",
    countDown: 3
  },

  onLoad: async ({ api }) => {
    // Initialize blockedThreads array safely
    if (!global.db) global.db = {};
    if (!global.db.autoBlockedThreads) global.db.autoBlockedThreads = [];

    console.log("AutoBlockedThreads initialized:", global.db.autoBlockedThreads);

    const messages = {
      "12:00:00 AM": { message: "সময় 12:00 AM - শুভ রাত!", attachmentURL: "" },
      "01:00:00 AM": { message: "সময় 1:00 AM - রাতের মেসেজ!", attachmentURL: "" },
      // এখানে আরো সময়ের মেসেজ যোগ করো
    };

    const checkTime = async () => {
      const now = moment().tz("Asia/Dhaka");
      const currentTime = now.format("hh:mm:ss A");

      const msg = messages[currentTime];
      if (msg) {
        if (!global.db.allThreadData) global.db.allThreadData = [];
        const threads = global.db.allThreadData.map(thread => thread.threadID);

        console.log("Sending message to threads:", threads);

        for (const threadID of threads) {
          if (global.db.autoBlockedThreads.includes(threadID)) continue;

          let messageData = { body: msg.message };
          if (msg.attachmentURL) {
            messageData.attachment = await global.utils.getStreamFromURL(msg.attachmentURL);
          }

          try {
            await api.sendMessage(messageData, threadID);
          } catch (err) {
            console.error("Error sending message to thread:", threadID, err);
          }
        }
      }

      // Check again next minute
      const nextMinute = moment().add(1, 'minute').startOf('minute');
      const msUntilNextMinute = nextMinute.diff(moment());
      setTimeout(checkTime, msUntilNextMinute);
    };

    checkTime();
  },

  onMessage: async ({ api, event }) => {
    if (!event.body) return;

    const body = event.body.toLowerCase().trim();
    console.log("Message received:", body, "from thread:", event.threadID);

    if (body.includes("auto off")) {
      if (!global.db.autoBlockedThreads.includes(event.threadID)) {
        global.db.autoBlockedThreads.push(event.threadID);
        return api.sendMessage("❌ এই গ্রুপে AutoMessage বন্ধ করা হলো।", event.threadID);
      } else {
        return api.sendMessage("⚠️ AutoMessage ইতিমধ্যেই বন্ধ।", event.threadID);
      }
    }

    if (body.includes("auto on")) {
      global.db.autoBlockedThreads = global.db.autoBlockedThreads.filter(id => id !== event.threadID);
      return api.sendMessage("✅ এই গ্রুপে AutoMessage চালু করা হলো।", event.threadID);
    }
  },

  onStart: () => {}
};
