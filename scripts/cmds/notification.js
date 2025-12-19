‎const { getStreamsFromAttachment } = global.utils;
‎
‎module.exports = {
‎	config: {
‎		name: "notification",
‎		aliases: ["noti"],
‎		version: "1.8",
‎		author: "NTKhang & Modified by Yeasin",
‎		countDown: 5,
‎		role: 2,
‎		description: {
‎			vi: "Gửi thông báo từ admin đến all box",
‎			en: "Send notification from admin to all box"
‎		},
‎		category: "owner",
‎		guide: {
‎			en: "{pn} <your message>"
‎		},
‎		envConfig: {
‎			delayPerGroup: 250
‎		}
‎	},
‎
‎	langs: {
‎		vi: {
‎			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm",
‎			notification: "Thông báo từ admin bot đến tất cả nhóm chat (không phản hồi tin nhắn này)",
‎			sendingNotification: "Bắt đầu gửi thông báo từ admin bot đến %1 nhóm chat",
‎			sentNotification: "✅ Đã gửi thông báo đến %1 nhóm thành công",
‎			errorSendingNotification: "Có lỗi xảy ra khi gửi đến %1 nhóm:\n%2"
‎		},
‎		en: {
‎			missingMessage: "𝐄𝐧𝐭𝐞𝐫 𝐦𝐬𝐠 :- ❗❗🚩",
‎			notification: "╭•┄┅════❁🌺❁════┅┄•╮\n❗🚨 𝐀𝐭𝐭𝐞𝐧𝐭𝐢𝐨𝐧 𝐚𝐥𝐥 📢\n╰•┄┅════❁🌺❁════┅┄•╯\n\n\n",
‎			sendingNotification: "সিয়াম বস নোটিফিকেশন পাঠাচ্ছি 💋👑⚡\n\n🪐😇",
‎			sentNotification: "✅ Sent notification to %1 groups successfully",
‎			errorSendingNotification: "An error occurred while sending to %1 groups:\n%2"
‎		}
‎	},
‎
‎	onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang, usersData }) {
‎		const { delayPerGroup } = envCommands[commandName];
‎		if (!args[0])
‎			return message.reply(getLang("missingMessage"));
‎
‎		// Get sender name
‎		const senderInfo = await usersData.get(event.senderID);
‎		const senderName = senderInfo?.name || "Someone";
‎
‎		const formSend = {
‎			body: `${getLang("notification")}\n────────────────\n${senderName}: ${args.join(" ")}`,
‎			attachment: await getStreamsFromAttachment(
‎				[
‎					...event.attachments,
‎					...(event.messageReply?.attachments || [])
‎				].filter(item => ["photo", "png", "animated_image", "video", "audio"].includes(item.type))
‎			)
‎		};
‎
‎		const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup);
‎		message.reply(getLang("sendingNotification", allThreadID.length));
‎
‎		let sendSucces = 0;
‎		const sendError = [];
‎		const wattingSend = [];
‎
‎		for (const thread of allThreadID) {
‎			const tid = thread.threadID;
‎			try {
‎				wattingSend.push({
‎					threadID: tid,
‎					pending: api.sendMessage(formSend, tid)
‎				});
‎				await new Promise(resolve => setTimeout(resolve, delayPerGroup));
‎			}
‎			catch (e) {
‎				sendError.push(tid);
‎			}
‎		}
‎
‎		for (const sended of wattingSend) {
‎			try {
‎				await sended.pending;
‎				sendSucces++;
‎			}
‎			catch (e) {
‎				const { errorDescription } = e;
‎				if (!sendError.some(item => item.errorDescription == errorDescription))
‎					sendError.push({
‎						threadIDs: [sended.threadID],
‎						errorDescription
‎					});
‎				else
‎					sendError.find(item => item.errorDescription == errorDescription).threadIDs.push(sended.threadID);
‎			}
‎		}
‎
‎		let msg = "";
‎		if (sendSucces > 0)
‎			msg += getLang("sentNotification", sendSucces) + "\n";
‎		if (sendError.length > 0)
‎			msg += getLang("errorSendingNotification", sendError.reduce((a, b) => a + b.threadIDs.length, 0), sendError.reduce((a, b) => a + `\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`, ""));
‎		message.reply(msg);
‎	}
‎};
‎
