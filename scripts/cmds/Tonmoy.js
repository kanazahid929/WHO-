const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "Tonmoy",
		version: "1.0",
		author: "siyam8881",
		countDown: 5,
		role: 2,
		shortDescription: "sarcasm",
		longDescription: "Responds with random media when someone says 'acs",
		category: "reply",
	},

	onStart: async function () {},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "Tonmoy") {
			const mediaLinks = [

     "https://files.catbox.moe/mchw3a.mp4 ",

						];

			const randomLink = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];
			const fileName = path.basename(randomLink);
			const filePath = path.join(__dirname, fileName);

			try {
				const response = await axios.get(randomLink, { responseType: "arraybuffer" });
				fs.writeFileSync(filePath, Buffer.from(response.data));

				await message.reply({
					body: "-!X-z⁶²M?\n\n々𝗪͜͡𝗛𝗢 -?  🎭👑\n\n\n\n- 々Tonmoy  𝗩𝗜𝗥𝗨𝗦🚩🏴‍☠️📨\n\n____________☠️⚡",
					attachment: fs.createReadStream(filePath)
				});
			} catch (err) {
				console.error("Failed to fetch media:", err.message);
				await message.reply("Sorry, couldn't load the media.");
			} finally {
				fs.unlink(filePath, () => {});
			}
		}
	}
};