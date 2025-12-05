 let autoIntervals = {};
let messageLists = {};

module.exports = {
  config: {
    name: "sk",
    aliases: ["sk"],
    version: "1.0",
    author: "Siyam Edit",
    role: 2,
    category: "owner",
    description: "Auto send 10 custom messages every 3 minutes"
  },

  onStart: async function ({ api, event, args }) {
    const action = args[0]?.toLowerCase();
    const threadID = args[1];

    if (!["start", "stop"].includes(action)) {
      return api.sendMessage(
        `𝐀𝐫𝐞 𝐲𝐨𝐮 𝐤𝐧𝐨𝐰 𝐭𝐡𝐢𝐬 𝐯𝐢𝐫𝐮𝐬 ??
𝐀𝐫𝐞 𝐲𝐨𝐮 𝐤𝐧𝐨𝐰 𝐰𝐡𝐨 𝐒𝐢𝐲𝐚𝐦 𝐕𝐢𝐫𝐮𝐬 👀👅💫`,
        event.threadID
      );
    }

    if (action === "start") {
      if (autoIntervals[threadID]) {
        return api.sendMessage(`⚠ Already running in thread ${threadID}`, event.threadID);
      }

      messageLists[threadID] = [
        `- 𝐬𝐨𝐛𝐚𝐢 𝐤𝐨𝐢 ?? 😌🪻🕸️\n\n\n🕷️🖇️`,
        `- 𝐊𝐢𝐫𝐚 𝐤𝐚𝐧𝐚 𝐑𝐨𝐜𝐤𝐲 🕸️🕸️😌𝐤𝐚𝐧𝐚 𝐑𝐨𝐜𝐤𝐲 𝐜𝐡𝐢𝐩𝐚𝐢 𝐛𝐠 𝐧𝐚𝐤𝐢.? 🤣🤣🤣`,
        `𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 ❤️‍🔥🥺`,
        `আমার জান সিয়ামকে কেউ দেখছো ??? আমার জামাই সিয়ামকে কোথাও খুঁজে পাচ্ছি না 😭😭😭\n\n😔😔`,
        `প্রিয় গ্রুপ বাসী তোমাদের কি অবস্থা তোমরা কি ভালো আছো? তোমরা কি আমার জামাই সিয়াম কে দেখেছ কোথাও 🥺❤️‍🔥 \n\nআমার ব্যক্তিগত মানুষটাকে আমি খুজে পাচ্ছি না 😒😓`,
        `এই গ্রুপের কেউ আমার জামাই সিয়ামের দিকে নজর দিবি না তাহলে চোখ তুলে ফেলবো 😒😒😒😒😌💚\n\nসবাইকে সাবধান করে দিলাম কোন মেয়ে আমার জামাইয়ের দিকে তাকাবি না 😇😇😇`,
        `☁☀    ☁         ☁  ☁         ☁️              ☁️
       ☁         🛩       ✈️                  🚁                ☁️
__🏬_🏨__🕍⛪️🏢🏪____🏦🏢__🏩💒___🕌
            🌴/  |  \         
         🌴 /🚘    \🌳         
        🌳/      |      \🧱      
     🌴 /🚖      🚘 \       🧱 🏗🧱
  🌳  /          |    🚍 \          
⛽  /  🚖      🚍       \           
🌴/            🚘            \🌴
 _/                                  \
পিপ  পিপ সাইড প্লিজ....!!🥀🦋🥸
শশুড় বাড়ি খুজতেছি 𝐒𝐨  𝐍𝐨 ডিস্টার্ব  প্লিজ.....!!🥀🦋🐯😒`,
        `সবাইকে ভালোবাসা অবিরাম আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু তোমাদের সবার জন্য দোয়া ও ভালোবাসা অফুরন্ত 😊🖤`,
        `গ্রুপের সবাই কই কা-রোর কোন খোঁজ খবর নাই কই থাকো তোমরা চিপা থেকে বের হও সবাইকে চিপা মোবারক🙈💫\n\n🖤😊`,
        `আজ আমার জামাই সিয়ামের মন ভালো নাই 😭😭😭😭\n\n এজন্য আমারও মন ভালো নাই কল লাগা গ্রুপে গান শুনবো 🥺🥺🥺🥺`,
        `𝐄𝐦𝐞𝐫𝐠𝐞𝐧𝐜𝐲 𝐆𝐅 𝐬𝐞𝐥𝐥 𝐇𝐨𝐛𝐞 𝐥𝐚𝐠𝐥𝐚, 𝐢𝐧𝐛𝐨𝐱 𝐡𝐢𝐠𝐡 𝐩𝐫𝐢𝐜𝐞 😎🖇️🔥`
      ];

      let index = 0;

      autoIntervals[threadID] = setInterval(() => {
        api.sendMessage(messageLists[threadID][index], threadID);

        index++;
        if (index >= 10) index = 0;
      }, 3 * 60 * 1000); // প্রতি 3 মিনিটে মেসেজ

      return api.sendMessage(`✅ Auto messages started every 3 minutes in thread ${threadID}`, event.threadID);
    }

    if (action === "stop") {
      if (!autoIntervals[threadID]) {
        return api.sendMessage(`⚠ No auto message running in thread ${threadID}`, event.threadID);
      }

      clearInterval(autoIntervals[threadID]);
      delete autoIntervals[threadID];
      delete messageLists[threadID];

      return api.sendMessage(`🛑 Auto messaging stopped in thread ${threadID}`, event.threadID);
    }
  }
};
