const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "rest",
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Khởi động lại bot",
			en: "Restart bot",
			bn: "বট রিস্টার্ট করুন"
		},
		category: "Owner",
		guide: {
			vi: "   {pn}: Khởi động lại bot",
			en: "   {pn}: Restart bot",
			bn: "   {pn}: বট রিস্টার্ট করুন"
		}
	},

	langs: {
		bn: { restartting: "🔄 - 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴❗....................\n👀🍫" },
		vi: { restartting: "🔄 | Đang khởi động lại bot..." },
		en: { restartting: "🔄 - 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴❗....................\n👀🍫" }
	},

	onLoad: function ({ api }) {
		const tmpFolder = path.join(__dirname, "tmp");
		if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder);

		const pathFile = path.join(tmpFolder, "restart.txt");
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(
				"🖤🚩 | 🔔𝗕𝗼𝘁 𝘂𝗽𝘁𝗶𝗺𝗲❗🏴\n🖇️🚩\n⏰ | Time: " + ((Date.now() - time) / 1000) + "s",
				tid
			);
			api.setMessageReaction("🔥", tid, () => {}, true);
			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const tmpFolder = path.join(__dirname, "tmp");
		if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder);

		const pathFile = path.join(tmpFolder, "restart.txt");
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await message.reply(getLang("restartting"));
		process.exit(2);
	},

	// ------------------- NO PREFIX -------------------
	onChat: async function ({ api, event, message, getLang }) {
		if (event.body?.toLowerCase() === "rest") {
			return this.onStart({ message, event, getLang });
		}
	}
};
