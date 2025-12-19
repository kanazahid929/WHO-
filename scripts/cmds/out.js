module.exports = {
	config: {
		name: "o",
		author: "xnil",
		role: 2,
		category: "admin",
		description: "Bot leaves the group when 'o' is typed"
	},

	// Required by framework
	onStart: async function () {},

	// No-prefix listener
	onChat: async function ({ api, event }) {
		if (!event.body) return;
		if (event.body.toLowerCase() !== "o") return;

		const threadID = event.threadID;

		const threadInfo = await api.getThreadInfo(threadID);
		if (!threadInfo.isGroup) {
			return api.sendMessage(
				"❌ This command only works in group chats.",
				threadID
			);
		}

		await api.sendMessage(
			"╭•┄┅════❁🌺❁════┅┄•╮\n❗🚨𝐆𝐨𝐨𝐝 𝐧𝐢𝐠𝐡𝐭 💤💋 📢\n╰•┄┅════❁🌺❁════┅┄•╯",
			threadID,
			() => api.removeUserFromGroup(api.getCurrentUserID(), threadID)
		);
	}
};
