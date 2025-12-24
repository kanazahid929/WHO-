module.exports = {
config: {
name: "boss",
version: "1.0",
author: "NTKhang | edited by Farhan",
countDown: 5,
role: 0,
shortDescription: "no prefix",
longDescription: "no prefix",
category: "no prefix",
},

onStart: async function(){}, 
onChat: async function({ event, message, getLang }) {
if (event.body && event.body.toLowerCase() === "Tanvir") {
return message.reply({
body: " ──────────◊\n  ❥➳ 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗮𝗹𝗮𝗶𝗸𝘂𝗺 ★★  \n\n  \n\n  𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 \n𝗦𝗶͜͡𝘆𝗮𝗺 ",
attachment: await global.utils.getStreamFromURL("")
});
}
}
}
