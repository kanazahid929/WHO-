const axios = require('axios');
const baseApiUrl = async () => {
    return "https://api.noobs-api.rf.gd/dipto";
};
module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(' - ');
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = (await usersData.get(number)).name;
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("5hqvi4us") || body.startsWith("xan") || body.startsWith("bot") || body.startsWith("siyam") || body.startsWith("milon") || body.startsWith("Milon")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["╭•┄┅════❁🌺❁════┅┄•╮\n\n✢━━━━━━━━━━━━━━━✢\n●───༆ কেউ সিয়াম বসের  বউকে দেখছো নি সিয়াম বস তার বউকে খুজে পাচ্ছে না 👻😩😑\n\n╰•┄┅════❁🌺❁════┅┄•╯\n✢━━━━━━━━━━━━━━━✢", "╭•┄┅════❁🌺❁════┅┄•╮\n\n✢━━━━━━━━━━━━━━━✢\n⸙//ফেসবুকে একটা বিন নাই এজন্য সিয়াম বস ফেসবুকে নাগিনদের ধরতে পারছে না 🐸🐷🐍\n\n\n╰•┄┅════❁🌺❁════┅┄•╯\n✢━━━━━━━━━━━━━━━✢, ╭•┄┅════❁🌺❁════┅┄•╮\n\n✢━━━━━━━━━━━━━━━✢\n⸙//সিয়াম বসের নেতৃত্বে আমি আজ ও সিঙ্গেল___🐸😑🐍🐷\n\n\n╰•┄┅════❁🌺❁════┅┄•╯\n\n✢━━━━━━━━━━━━━━━✢","😎😁😁😁বাংলা চটি হিসাব অনুযায়ী ২০০৭ নাম্বার পৃষ্ঠায় লেখা হয়েছিল কি লেখা হয়েছিল এটা এখনো জানা যায়নি কেন জানা যায়নি এটার কারণও দেওয়া হয়নি বাংলা চটি হিসাবে কিন্তু বাংলা চটি হিসেবে এটা কেন পাওয়া যায়নি এটা নিয়ে অনেক বক্তব্য শুরু হয়েছিল কি কারণে শুরু হয়েছিল এটা 2003 নাম্বার পৃষ্ঠায় লিখতে গিয়ে ২০০১ পৃষ্ঠায় লেখা হয়ে যায় কি কারনেই ভুলটা হয়েছিল সেটা দেখতে চোখ রাখুন সিয়াম ভাইয়ের বাংলা হিসাব ৬১ নং কবিতার লাইনে 😌✨","\\- সিয়াম বস তার হবু বউকে নিয়ে ঘুরতে গেছে - 😎😐🥹\n\nবসের ৭টা না ১০ টা না‌ ১ টাই বউ তাও আবার শুধুমাত্র চটি গল্পে বাস্তবে আর না 😝🥺🌝","- সিয়াম boss  তার future বউকে নিয়ে market এ🫠\nবউ বলে, আমার কি লাগে? সিয়াম বস বললো কি চাও তুমি তোমাকে তাই দিবো 🥺\n বসের বউ বললো আমার পুরা মার্কেট চাই সিয়াম বস তার বন্ধু আলীকে কল দিয়ে বলে বন্ধু এটা কি মেয়ে ঠিক করেছিস 😭😭","বস সিয়াম এবং আলী - বের হয়েছে বন্ধু রকির জিএফ খুঁজতে বন্ধু রকির ফিউচার জিএফ এখনো পাওয়া যায়নি কেউ হলে লাইন‌্ দিয়ে বসে‌ থাক 😎😁😝", "- আমাকে না‌ ডেকে আমার বস সিয়ামকে নিয়ে ঘুরতো‌ যাও - 🥹💚🍭 আমার বস সিয়াম ভাইয়ের আজ মন ভালো নেই \n\n\n🥺💝","」༊࿐•—»🍭𝐂𝐄𝐎⸙𝐒𝐄𝐘𝐀𝐌🌈«—•💫(✷‿✷)°\n╭•┄┅════❁🌺❁════┅┄•╮\n\\n✢━━━━━━━━━━━━━━━✢\n╭────────────♡彡_____倫—•♡︎ সাইকোলজি বলে আপনি যখন কারো কথা মন থেকে ভাবেন পৃথিবীর অন্য প্রান্তে বসে সেই মানুষটা ও আপনার কথাই ভাবে🥺✨\n\n╰•┄┅════❁❁════┅┄•╯\n\n\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ✨🍥\n╭────────────♡彡 ╰➤😻🍭𝘾 𝙀 𝙊 - 𝙎𝙀𝙔𝘼𝙈👀\n______________________________","╭•┄┅════❁🌺❁════┅┄•╮\n\n✢━━━━━━━━━━━━━━━✢\n⸙//পৃথিবীতে সবাই প্রেম করে কিন্তু আমার বস সিয়াম ভাইকে সবাই সন্দেহে করে👀🥲🥴\n\n╰•┄┅════❁🌺❁════┅┄•╯\n✢━━━━━━━━━━━━━━━✢", "বাংলা হিসাব অনুযায়ী - সিয়াম বস এখন অনেক বিজি 😻💚 \n- কি খবর তোর বল !  "];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
