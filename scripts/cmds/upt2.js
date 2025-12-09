 const os = require("os");

module.exports = {
  config: {
    name: "upt",
    version: "2.3",
    author: "xnil6x",
    role: 0,
    category: "system",
    guide: "upt"
  },
  onStart: async function ({ message, event, threadsData }) {
    try {
      const t = process.uptime();
      const d = Math.floor(t / 86400);
      const h = Math.floor((t % 86400) / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = Math.floor(t % 60);
      const uptimeString = `${d}d ${h}h ${m}m ${s}s`;

      const cpu = os.cpus()[0].model;
      const cores = os.cpus().length;
      const usedMem = (os.totalmem() - os.freemem()) / 1024 / 1024;
      const totalMem = os.totalmem() / 1024 / 1024;

      const prefix = global.GoatBot?.config?.PREFIX || "/";
      const totalThreads = (await threadsData.getAll()).length;
      const totalCommands = global.GoatBot.commands.size;

      const line = "═".repeat(40);
      const box = `
╔${line}╗
║ 🛠️  𝗨𝗽𝘁𝗶𝗺𝗲 & 𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘀
╟${line}╢
║ ⏳ Uptime     : ${uptimeString}
║ ⚙️ CPU        : ${cpu} (${cores} cores)
║ ⚡ RAM        : ${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} MB
║ 💾 Platform   : ${os.platform()} (${os.arch()})
║ 🖥️ Hostname   : ${os.hostname()}
║ 🎯 Threads    : ${totalThreads}
║ 🧩 Commands   : ${totalCommands}
║ 📨 Node.js    : ${process.version}
║ 🪄 Prefix     : ${prefix}
╚${line}╝`;

      message.reply(box);

    } catch (err) {
      message.reply(`❌ Error:\n${err.message}`);
    }
  },
  onChat: async function ({ message, event, threadsData }) {
    try {
      if (!event.body || event.body.toLowerCase() !== "upt") return;
      const t = process.uptime();
      const d = Math.floor(t / 86400);
      const h = Math.floor((t % 86400) / 3600);
      const m = Math.floor((t % 3600) / 60);
      const s = Math.floor(t % 60);
      const uptimeString = `${d}d ${h}h ${m}m ${s}s`;

      const cpu = os.cpus()[0].model;
      const cores = os.cpus().length;
      const usedMem = (os.totalmem() - os.freemem()) / 1024 / 1024;
      const totalMem = os.totalmem() / 1024 / 1024;

      const prefix = global.GoatBot?.config?.PREFIX || "/";
      const totalThreads = (await threadsData.getAll()).length;
      const totalCommands = global.GoatBot.commands.size;

      const line = "═".repeat(40);
      const box = `
╔${line}╗
║ 🛠️  𝗨𝗽𝘁𝗶𝗺𝗲 & 𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘀
╟${line}╢
║ ⏳ Uptime     : ${uptimeString}
║ ⚙️ CPU        : ${cpu} (${cores} cores)
║ ⚡ RAM        : ${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} MB
║ 💾 Platform   : ${os.platform()} (${os.arch()})
║ 🖥️ Hostname   : ${os.hostname()}
║ 🎯 Threads    : ${totalThreads}
║ 🧩 Commands   : ${totalCommands}
║ 📨 Node.js    : ${process.version}
║ 🪄 Prefix     : ${prefix}
╚${line}╝`;

      message.reply({ body: box, attachment: await global.utils.getStreamFromUrl("https://files.catbox.moe/4zdakr.jpg") });

    } catch (err) {
      message.reply(`❌ Error:\n${err.message}`);
    }
  }
};
