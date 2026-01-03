module.exports = {
	config: {
		name: "kick",
		version: "1.6",
		author: "NTKhang + edit by Siyam",
		countDown: 5,
		role: 1,
		description: {
			vi: "Kick thành viên khỏi box chat",
			en: "Kick member out of chat box"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} @tags | kick all",
			en: "   {pn} @tags | kick all"
		}
	},

	langs: {
		vi: {
			needAdmin: "Vui lòng thêm quản trị viên cho bot trước khi sử dụng tính năng này"
		},
		en: {
			needAdmin: "Please add admin for bot before using this feature"
		}
	},

	onStart: async function ({ message, event, args, api, getLang }) {

		const botID = api.getCurrentUserID();

		// 🔥 BOT ADMIN LIST (real bot admins)
		const botAdmins = global.GoatBot?.config?.adminBot || [];

		async function kick(uid) {
			try {
				await api.removeUserFromGroup(uid, event.threadID);
			} catch (e) {}
		}

		// 🔥 kick all (BOT + BOT ADMINS SAFE)
		if (args[0] && args[0].toLowerCase() === "all") {
			const threadInfo = await api.getThreadInfo(event.threadID);

			for (const uid of threadInfo.participantIDs) {

				// ❌ bot kick হবে না
				if (uid === botID) continue;

				// ❌ bot admin kick হবে না
				if (botAdmins.includes(uid)) continue;

				await kick(uid);
			}
			return;
		}

		// normal kick
		if (!args[0]) {
			if (!event.messageReply)
				return message.SyntaxError();
			await kick(event.messageReply.senderID);
		} else {
			const uids = Object.keys(event.mentions);
			if (uids.length === 0)
				return message.SyntaxError();

			for (const uid of uids)
				await kick(uid);
		}
	}
};
