const os = require("os");

module.exports = {
  config: {
    name: "upt",
    version: "2.3",
    author: "xnil6x",
    role: 0,
    category: "system",
    guide: "upt",
    noPrefix: true
  },

  onStart: async function ({ message, threadsData }) {
    try {
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const cpu = os.cpus()[0]?.model || "Unknown CPU";
      const cores = os.cpus()?.length || 0;
      const platform = os.platform();
      const arch = os.arch();
      const nodeVersion = process.version;
      const hostname = os.hostname();
      const totalMem = os.totalmem() / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024;
      const usedMem = totalMem - freeMem;

      const prefix = global.GoatBot?.config?.PREFIX || "/";
      const totalThreads = threadsData && typeof threadsData.getAll === "function"
        ? (await threadsData.getAll()).length
        : 0;
      const totalCommands = global.GoatBot?.commands?.size || 0;

      const line = "═".repeat(40);
      const box = `
╔${line}╗
║ 🛠️  𝗨𝗽𝘁𝗶𝗺𝗲 & 𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘀
╟${line}╢
║ ⏳ Uptime      : ${uptimeString}
║ ⚙️ CPU         : ${cpu} (${cores} cores)
║ ⚡ RAM Used    : ${usedMem.toFixed(2)} MB / ${totalMem.toFixed(2)} MB
║ 💾 Platform    : ${platform} (${arch})
║ 🖥️ Hostname     : ${hostname}
║ 🎯 Threads     : ${totalThreads}
║ ‼️ Commands    : ${totalCommands}
║ 📨 Node.js     : ${nodeVersion}
║ 🪄 Prefix      : ${prefix}
╚${line}╝`;

      if (typeof message.reply === "function") {
        message.reply(box);
      } else if (global.api) {
        global.api.sendMessage(box, message.threadID);
      }
    } catch (err) {
      if (message?.reply) message.reply(`❌ Error fetching system info:\n${err.message}`);
    }
  }
};
