require("dotenv").config()
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Database } = require('quickmongo');
const db = new Database(process.env.quickmongo)//ضروري جدا تحط رابط داتا بيس
//شرح ازاي تجيب داتا بيس: https://www.youtube.com/watch?v=FuDX2Fk8FD8
db.on("ready", () => {
	console.log(`Database Connected`)
})

client.on("ready" , () => {
const commands = [{
name: "set-channel",description: "set sugg channel",
options: [{name : "channel",description: "..",type: 6, required: true }] 
},{
name: "cancel-sugg",
description:"cancel suggestin system",
},{
name: "enable-sugg",
description: "enable suggestin system"
},{
name: "info",
description: "show some infos about the bot",
},{
name: "set-line",description:"set line for ssuggestin",
options:[{name: "line-link", description: "set the line",type:3, required: true}]
},{
name: "set-emoji1",description:"set line for ssuggestin",
options:[{name: "emojji", description: "set emojji",type:3, required: true}]
},{
name: "set-emoji2",description:"set line for ssuggestin",
options:[{name: "emojji2", description: "set emojji2",type:3, required: true}]
},{
name:"help",
description: "Commands List"
},{
name: "blacklist",description: "blacklist users",
options: [{name : "user",description: ".",type: 6, required:true}]
},{
name: "unblacklist",description: "unblacklist from users",
options: [{name : "user",description: "..",type: 6, required:true}]
}]
        const rest = new REST({ version: '9' }).setToken(process.env.token);
        (async () => {
            try {
             await rest.put(
             Routes.applicationCommands(client.user.id),
             { body: commands },
            );
            console.log(client.user.tag + " Online");
            } catch (error) {
        console.error(error);
        }
    })();
})
const system = ["772546533203247115"]//ايدي شخص الي هيدي بلاك ليست
client.on('interactionCreate', async interaction => {
if(!interaction.isCommand()) return;
await interaction.deferReply({ephemeral: true})
if(interaction.commandName == "blacklist"){
if(!system.includes(interaction.user.id))return;
let user = interaction.options.getUser('user')
if(user.bot)return await interaction.editReply({content: "> :joy: - **This User is A Bot i can't blacklist bot**", ephemeral: true})
if(user){
let black = await db.fetch(`blu_${user.id}`)
if(black === true)return await interaction.editReply({content:"> :x: - **This user already in blacklist**", ephemeral: true})
if(black === null || black == false){
await db.set(`blu_${user.id}`,true)
await interaction.editReply({content: `> ✅ - **Done Add ${user} in Blacklist**`})
}}
} else
if(interaction.commandName == "unblacklist"){
if(!system.includes(interaction.user.id))return;
let user = interaction.options.getUser('name')
if(user){
  let black = await db.fetch(`blu_${user.id}`)
  if(black === null || black === false)return await interaction.editReply({content:"> :x: - **This user is already unblacklisted**", ephemeral: true})
  if(black === true){
    await db.delete(`blu_${user.id}`, false)
}}
    await interaction.editReply({content: `> ✅ - **Done Unbalcklisted ${user}**`})
  }else
  if(interaction.commandName == "set-channel"){
    if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> :joy: - **What do you want pro.**", ephemeral: true});
    if(interaction.user.bot)return
    let channel = interaction.options.getChannel('channel')
   await db.set(`channel_${interaction.guild.id}`,channel.id)
   await db.set(`status_${interaction.guild.id}` , "enabled")
   await interaction.editReply({content:`> ✅ - **Done SetChannel to ${channel}**`});
} else
if(interaction.commandName == "cancel-sugg"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> :joy: - **What do you want pro.**", ephemeral: true});
   const data = await db.get(`channel_${interaction.guild.id}`)
  await db.set(`status_${interaction.guild.id}` , "disabled")
  await interaction.editReply({content: `> ✅ - **Done cancel the suggestin system**`, ephemeral: true})
} else 
if(interaction.commandName == "enable-sugg"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> :joy: - **What do you want pro.**", ephemeral: true});
    const data = await db.get(`channel_${interaction.guild.id}`)
    await db.set(`status_${interaction.guild.id}` , "enabled")
 await interaction.editReply({content: `> ✅ - **Done enabled the suggestin system**`, ephemeral: true})
} else
if(interaction.commandName == "info"){
const humanizeDuration = require("humanize-duration");
let time = await humanizeDuration(client.uptime)
let data = await db.fetchLatency()
  let embed = new  MessageEmbed()
  .setAuthor({iconURL:interaction.user.avatarURL({dynamic: true}),name: interaction.user.tag})
  .addField(`:ping_pong: - Ping`,`\`${client.ws.ping}Ms\``, true)
  .addField(`🔧 - Developer`, `<@772546533203247115>`, true)
  .addField(`:ping_pong: DataBase Ping`, `\`${data.average}Ms\``, true)
.addField(`🧭 - UptimeCount`, `
\`\`\`fix

${time}
\`\`\``, true)
  .setColor("#2f3136")
  .setThumbnail("https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024")
  .setFooter({text:"©️ All rights reserved 2021 - 2022 , 'OnlyMahmouud.#0799",iconURL:'https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024'})
  await interaction.editReply({embeds: [embed], ephemeral: true})
} else 
if(interaction.commandName == "set-line"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> :joy: - **What do you want pro.**", ephemeral: true});
  let linee = interaction.options.getString("line-link")
  await db.set(`line_${interaction.guild.id}`, `${linee}`)
  await interaction.editReply({content: `> ✅ - **Done Add This Line:** ${linee}`, ephemeral: true})
} else
  if(interaction.commandName == "set-emoji1"){
    if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> :joy: - **What do you want pro.**", ephemeral: true});
    let emoj = interaction.options.getString("emojji")
    await db.set(`react_${interaction.guild.id}`, `${emoj}`)
    await interaction.editReply({content: `> ✅ - **Done Add This Emojji:** ${emoj}`, ephemeral: true})
} else
if(interaction.commandName == "set-emoji2"){
  if(!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.editReply({content: "> :joy: - **What do you want pro.**", ephemeral: true});
  let emoj = interaction.options.getString("emojji2")
  await db.set(`react2_${interaction.guild.id}`, `${emoj}`)
  await interaction.editReply({content: `> ✅ - **Done Add This Emojji:** ${emoj}`, ephemeral: true})
} else
if(interaction.commandName == "help"){
const prefix = "/"
let embed = new  MessageEmbed()
.setAuthor({iconURL:interaction.user.avatarURL({dynamic: true}),name: interaction.user.tag})
.addField(`❓ - Suggestion Commands:`,`
**\`${prefix}set-channel\`**\n> Desc: تحديد روم الاقتراحات\n
**\`${prefix}set-line\`**\n> Desc: تحديد الخط الي هينرسل تحت الاقتراحات\n
**\`${prefix}set-emoji1\`**\n> Desc: تحديد الايموجي الاول\n
**\`${prefix}set-emoji2\`**\n> Desc: تحديد الايموجي الثاني\n
**\`${prefix}cancel-sugg\`**\n> Desc: تعطيل روم الاقتراحات\n
**\`${prefix}enable-sugg\`**\n> Desc: تفعيل روم الاقتراحات
`,true)
.addField(`🌍 - General Commands:`,`
**\`${prefix}info\`**\n> Desc: لاظهار معلومات البوت\n
**\`${prefix}help\`**\n> Desc: لاظهار اوامر البوت
`,true)
.setColor("#2f3136")
.setThumbnail("https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024")
.setFooter({text:"©️ All rights reserved 2021 - 2022 , 'OnlyMahmouud.#0799",iconURL:'https://cdn.discordapp.com/avatars/772546533203247115/0d6385f61246fdcff4d190d08b59146e.png?size=1024'})
await interaction.editReply({embeds: [embed], ephemeral: true})
}
})
client.on('messageCreate', async OnlyMahmoud => {
let data = await db.fetch(`blu_${OnlyMahmoud.author.id}`)
if(data === true) return
if(OnlyMahmoud.author.bot) return;
let channel = await db.get(`channel_${OnlyMahmoud.guild.id}`)
let status = await db.get(`status_${OnlyMahmoud.guild.id}`)
let line = await db.get(`line_${OnlyMahmoud.guild.id}`)
let react = await db.get(`react_${OnlyMahmoud.guild.id}`)
let react2 = await db.get(`react2_${OnlyMahmoud.guild.id}`)
if(OnlyMahmoud.channel.id != channel) return;
if(status !== "enabled")return;
if(OnlyMahmoud.content.startsWith('96')) return;
let thailand = OnlyMahmoud.content.split(' ').slice(0).join(' ');
OnlyMahmoud.delete();
let discord_gg_thailandcodes = new MessageEmbed()
.setAuthor({name:'From : ' + OnlyMahmoud.author.username,iconURL: OnlyMahmoud.author.avatarURL({ dynamic: true })})
.setColor("#2f3136")
.setThumbnail(OnlyMahmoud.guild.iconURL({dynamic: true}))
.setFooter({text: "Suggester Id: "+OnlyMahmoud.author.id,iconURL:client.user.avatarURL()})
.setTitle(`Suggestion:`)
.setDescription(`\n${thailand}\n`)
.setTimestamp(); 
OnlyMahmoud.channel.send({embeds: [discord_gg_thailandcodes]}).then(thailand_codes => {
thailand_codes.react(react).then(() => {
thailand_codes.react(react2).then(() => {
thailand_codes.channel.send({files:[line]})
})})})})

client.login(process.env.token)
