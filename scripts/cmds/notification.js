const { getStreamsFromAttachment } = global.utils;

module.exports = {
	config: {
		name: "notification",
		aliases: ["noti"],
		version: "1.9",
		author: "NTKhang & Modified by Yeasin",
		countDown: 5,
		role: 2,
		category: "owner",
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		en: {
			missingMessage: "𝐄𝐧𝐭𝐞𝐫 𝐦𝐬𝐠 :- ❗❗🚩",
			notification:
				"╭•┄┅════❁🌺❁════┅┄•╮\n" +
				"❗🚨 𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧 𝐚𝐥𝐥 📢\n" +
				"╰•┄┅════❁🌺❁════┅┄•╯\n\n",
			sendingNotification: "সিয়াম বস নোটিফিকেশন পাঠাচ্ছি 💋👑⚡\n\n🪐😇",
			sentNotification: "✅ Sent notification to %1 groups successfully",
			errorSendingNotification: "❌ Failed in %1 groups:\n%2"
		}
	},

	onStart: async function ({
		message, api, event, args,
		commandName, envCommands,
		threadsData, getLang, usersData
	}) {

		const { delayPerGroup } = envCommands[commandName];
		if (!args.length)
			return message.reply(getLang("missingMessage"));

		const senderInfo = await usersData.get(event.senderID);
		const senderName = senderInfo?.name || "Admin";

		const formSend = {
			body: `${getLang("notification")}━━━━━━━━━━━━━━━━\n${senderName}: ${args.join(" ")}`,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(i =>
					["photo", "png", "animated_image", "video", "audio"].includes(i.type)
				)
			)
		};

		const allThreadID = (await threadsData.getAll())
			.filter(t => t.isGroup &&
				t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup
			);

		message.reply(getLang("sendingNotification", allThreadID.length));

		let sendSuccess = 0;
		const sendError = [];
		const waitingSend = [];

		for (const thread of allThreadID) {
			waitingSend.push({
				threadID: thread.threadID,
				pending: api.sendMessage(formSend, thread.threadID)
			});
			await new Promise(r => setTimeout(r, delayPerGroup));
		}

		for (const item of waitingSend) {
			try {
				await item.pending;
				sendSuccess++;
			}
			catch (e) {
				const errorDescription = e?.errorDescription || "Unknown error";
				let err = sendError.find(i => i.errorDescription === errorDescription);
				if (!err) {
					err = { errorDescription, threadIDs: [] };
					sendError.push(err);
				}
				err.threadIDs.push(item.threadID);
			}
		}

		let msg = "";
		if (sendSuccess)
			msg += getLang("sentNotification", sendSuccess) + "\n";

		if (sendError.length)
			msg += getLang(
				"errorSendingNotification",
				sendError.reduce((a, b) => a + b.threadIDs.length, 0),
				sendError.map(e =>
					`- ${e.errorDescription}\n  + ${e.threadIDs.join("\n  + ")}`
				).join("\n")
			);

		message.reply(msg || "Done");
	}
};
