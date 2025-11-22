const fs = require("fs");

module.exports = {
	config: {
		name: "npx3",
		version: "1.0",
		author: "siyamvai",
		countDown: 5,
		role: 0,
		description: {
			en: "Auto play audio when trigger words are detected"
		},
		category: "no prefix",
		guide: {
			en: "no prefix needed - auto trigger"
		}
	},

	onChat: async function ({ api, event }) {
		const { threadID, messageID, body } = event;
		if (!body) return;

		const text = body.toLowerCase();

		const triggers = ["😍", "☺️", "😘", "9k", "🫣"];

		if (triggers.some(t => text.includes(t))) {

			const filePath = __dirname + "/siyam/bold.mp3";

			api.sendMessage({
				body: "😻🍭",
				attachment: fs.createReadStream(filePath)
			}, threadID, messageID);

			api.setMessageReaction("👀", messageID, () => {}, true);
		}
	},

	onStart: async function () {}
};
