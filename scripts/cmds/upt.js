const os = require("os");

module.exports = {
  config: {
    name: "upt",       // কমান্ডের নাম
    version: "2.3",
    author: "xnil6x",
    role: 0,
    category: "system",
    guide: "upt",
    noPrefix: true      // ✅ no-prefix চালু
  },

  onStart: async function ({ message, threadsData }) {
    try {
      // Uptime
      const uptime = process.uptime();
      const days = Math.floor(uptime / (60 * 60 * 24));
      const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((uptime % (60 * 60)) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // System info
      const cpu = os.cpus()[0].model;
      const cores = os.cpus().length;
      const platform = os.platform();
      const arch = os.arch();
      const nodeVersion = process.version;
      const hostname = os.hostname();
      const totalMem = os.totalmem() / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024;
      const usedMem = totalMem - freeMem;

      // Bot info
      const prefix = global.GoatBot?.config?.PREFIX || "/";
      const totalThreads = await threadsData.getAll().then(t => t.length);
      const totalCommands = global.GoatBot.commands.size;

      // Box design
      const line = "═".repeat(40);
      const box = `
╔${line}╗
║ 🛠️  𝗨𝗽𝘁𝗶𝗺𝗲 & 𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘀
╟${line}╢
║ ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲        : ${uptimeString}
║ ⚙️ 𝗖𝗣𝗨           : ${cpu} (${cores} cores)
║ ⚡ 𝗥𝗔𝗠 𝗨𝘀𝗲𝗱     : ${usedMem.toFixed(2)} MB / ${totalMem.toFixed(2)} MB
║ 💾 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺      : ${platform} (${arch})
║ 🖥️ 𝗛𝗼𝘀𝘁𝗻𝗮𝗺𝗲      : ${hostname}
║ 🎯 𝗧𝗵𝗿𝗲𝗮𝗱𝘀      : ${totalThreads}
║ ‼️ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀     : ${totalCommands}
║ 📨𝗡𝗼𝗱𝗲.𝗷𝘀       : ${nodeVersion}
║ 🪄 𝗣𝗿𝗲𝗳𝗶𝘅        : ${prefix}
╚${line}╝`;

      message.reply(box);
    } catch (err) {
      message.reply(`❌ Error fetching system info:\n${err.message}`);
    }
  }
};
