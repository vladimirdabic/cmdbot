const Discord = require('discord.js');
const music = require('discord.js-music');
const client = new Discord.Client();
const fs = require("fs");
let commandSave = JSON.parse(fs.readFileSync("./commands.json", "utf8"));

commands = {}

function parseArgs(commandtext) {
	args = []
	curarg = ""
	instring = false
	char = ""
	escapedquote = false
	curstring = ""
	commandtext = commandtext + "\\end"
	cmdtext = commandtext
	for (var i = 0; i < commandtext.length; i++) {
		curarg += commandtext.charAt(i)
		char = commandtext.charAt(i)
		//console.log(char)
		//console.log(curarg)
		if (char == "\\" && cmdtext.charAt(i+1) == "\"") {
			escapedquote = true
			curstring = curstring.slice(0, -1)
		}
		if (instring == true) {
			curstring += char
		}
		if (char == "\"") {
			if (instring == false && escapedquote == false) {
				instring = true
				curarg = ""
				char = ""
				curstring = ""
			}
			else if (instring == true && escapedquote == false) {
				instring = false
				curstring = curstring.slice(0, -1)
				args.push(curstring)
				curarg = ""
				curstring = ""
			}
			if (escapedquote == true) {
				escapedquote = false
			}
		}
		if (char == " ") {
			if (instring == false) {
				if (curarg != "" && curarg != " ") {
					curarg = curarg.slice(0, -1)
					args.push(curarg)
					curarg = ""
				}
			}
		}
		if (char == "\\" && cmdtext.charAt(i+1) == "e" && cmdtext.charAt(i+2) == "n" && cmdtext.charAt(i+3) == "d") {
			curarg = curarg.slice(0, -1)
			args.push(curarg)
			curarg = ""
		}
	}
	return args
}

botprefix = "cm!"

client.on('ready', () => {
	console.log(`SBot Started!`);
	commands = commandSave
	client.user.setActivity(`over ${client.guilds.size} guilds | 1.0`, { type: 'WATCHING' })
	client.guilds.forEach((guild) => {
		if (!commands[guild.id]) {
			commands[guild.id] = {}
		}
		guild.members.get(client.user.id).setNickname("Command Manager");
	});
});

client.on("guildCreate", guild => {
	console.log("Joined a new guild: " + guild.name);
	guildlist = client.guilds
	client.user.setActivity(`over ${client.guilds.size} guilds | 1.0`, { type: 'WATCHING' })
	if (!commands[guild.id]) {
		commands[guild.id] = {}
	}
})

client.on("guildDelete", guild => {
	client.user.setActivity(`over ${client.guilds.size} guilds | 1.0`, { type: 'WATCHING' })
	console.log("Left a guild: " + guild.name);
})

client.on('message', async (message) => {
	if(message.author.bot) return;
	guild = message.guild
	msg_author = message.author
	var seperator = ";; "
	const argsN = message.content.split(/ +/g);
	const args = message.content.split(seperator);
	const command = argsN.shift();
	const parms = parseArgs(message.content)
	if (seperator != " ") {
		args[0] = args[0].replace(command + " ", "")
	}
	else {
		args.shift()
	}

	// console.log(commands)

	if (command == botprefix + "setup") {
		if (!commands[guild.id]) {
			commands[guild.id] = {}
		}
		createdembed = new Discord.RichEmbed().setTitle("Command Manager").setDescription("Setup Complete!" ).setColor(0x2eb081);
			message.channel.send({embed: createdembed})
			return
	}

	if (commands[guild.id][command]) {
		embeds = {}
		function sendMessage(msg) {
			message.channel.send(msg)
		}
		function sendDirectMessage(user, message) {
			message.user.send(message)
		}
		function sendEmbed(embedname) {
			message.channel.send({embed: embedname})
		}
		function createEmbed() {
			return new Discord.RichEmbed()
		}
		function addEmbedField(embed, title, value) {
			embed.addField(title, value, false)
		}
		function setEmbedDesc(embed, value) {
			embed.setDescription(value)
		}
		function setEmbedTitle(embed, value) {
			embed.setTitle(value)
		}
		function setEmbedColor(embed, color) {
			embed.setColor(color)
		}
		function setEmbedImage(embed, url) {
			embed.setImage(url)
		}
		function setEmbedThumbnail(embed, url) {
			embed.setThumbnail(url)
		}
		function setEmbedAuthor(authorname, icon_url) {
			embed.setAuthor(authorname, icon_url)
		}
		function getFirstMention() {
			return message.mentions.members.first();
		}
		function findMember(type, searchval) {
			if (type == "name") {
				return message.guild.members.find(member => member.user.username === searchval)
			}
			if (type == "displayName") {
				return message.guild.members.find(member => member.displayName === searchval)
			}
			if (type == "id") {
				return message.guild.members.find(member => member.id === searchval)
			}
			if (type == "color") {
				return message.guild.members.find(member => member.displayColor === searchval)
			}
			return "None"
		}
		function findChannel(type, searchval) {
			if (type == "name") {
				return message.guild.channels.find(channel => channel.name === searchval)
			}
			if (type == "id") {
				return message.guild.channels.find(channel => channel.id === searchval)
			}
			return "None"
		}
		function setBotName(name) {
			return message.guild.members.get(client.user.id).setNickname(name);
		}
		function storeParameter(varName, parameter) {
			eval(varName + " = argsN[" + parameter + "]") 
		}
		//console.log("Command '" + command + "' executed in guild '" + guild + "' (" + guild.id + ")")
		try {
			let evaled = await eval(commands[guild.id][command])
		}
		catch (e) {
			errorembed = new Discord.RichEmbed().setTitle("ERROR").setDescription("`" + e + "`").setColor(0xff0333)
			message.channel.send({embed: errorembed})
		}
	}

	if (command == botprefix + "bcservers") {
		if (message.author.username == "SealedKiller") {
			for (server in commands) {
				var keys = Object.keys(commands)
				for(var i = 0; i < keys.length;i++){
					 //keys[i] for key
					sendto = client.guilds.get(keys[i])
					sendto.defaultChannel.send(argsN.join(" "))
   				//dictionary[keys[i]] for the value
				}
			}
		}
	}

	if (command == botprefix + "invite") {
		message.channel.send("***Invite link:***\n`https://discordapp.com/api/oauth2/authorize?client_id=479737992513191978&permissions=8&scope=bot`")
	}

	//if (command == botprefix + "serverlist") {
		//message.channel.send(JSON.stringify(commands))
	//}
	if (command == botprefix + "help") {
		var codeMsg = "```"
		//message.channel.send(`${codeMsg}\ncm!help                          Shows this menu.\ncm!addcommand <command>          Adds a command\ncm!deletecommand <command>       Deletes a command.\ncm!setcode <command>;; <code>    Sets the code.\ncm!showcode <command>            Shows the code of a command\ncm!commands                      Lists all the commands\n${codeMsg}`)
		embed = new Discord.RichEmbed().setTitle("**HELP**").setColor(0x2eb081)
		embed.setDescription("\n  \n  \n  **cm!help** - Shows this menu.\n  **cm!addcommand <command>** - Makes a new command.\n  **cm!setcode <command>;; <code>** - Sets code for a specified command.\n  **cm!deletecommand** - Deletes a command\n  **cm!commands** - Shows all the commands you made.\n  **cm!invite** - Bot's invite link.\n  \n  ")
		message.channel.send({embed: embed})
	}

	if (command == botprefix + "addcommand") {
		if (!message.member.roles.find(role => role.name === "CMDBotEditor") || message.author.username != "SealedKiller") {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("You don't have the permission!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
		if (!commands[guild.id][args[0]]) {
			message.delete()
			commands[guild.id][args[0]] = "message.channel.send(\"No Code Found!\")"
			console.log("Command added: '" + args[0] + "' to guild: '" + guild + "' (" + guild.id + ")")
			createdembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Command `" + args[0] + "` created! set the code by using ```cm!setcode " + args[0] + ";; <code>```" ).setColor(0x2eb081);
			message.channel.send({embed: createdembed})
			fs.writeFile("./commands.json", JSON.stringify(commands), (err) => {
				if (err) console.error(err)
			});
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Command `" + args[0] + "` already exists!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
		}
	}

	if (command == botprefix + "deletecommand") {
		if (!message.member.roles.find(role => role.name === "CMDBotEditor") || message.author.username != "SealedKiller") {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("You don't have the permission!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
		if (commands[guild.id][args[0]]) {
			delete commands[guild.id][args[0]]
			console.log("Command deleted: '" + args[0] + "' from guild: '" + guild + "' (" + guild.id + ")")
			createdembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Command `" + args[0] + "` was deleted" ).setColor(0xc46606);
			message.channel.send({embed: createdembed})
			fs.writeFile("./commands.json", JSON.stringify(commands), (err) => {
				if (err) console.error(err)
			});
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Command `" + args[0] + "` not found!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
		}
	}

	//if (command == botprefix + "evalcode") {
		//message.channel.send("Code: "+ args[0])
		//eval(args[0])
	//}

	if (command == botprefix + "setcode") {
		if (message.member.roles.find(role => role.name === "CMDBotEditor") || message.author.username == "SealedKiller") {
			if (commands[guild.id][args[0]]) {
				if (args[1]) {
					if (args[1].indexOf("client.token") !== -1 || args[1].indexOf("client.destroy") !== -1 || args[1].indexOf("member.addRole") !== -1 || args[1].indexOf("member.kick") !== -1 || args[1].indexOf("member.ban") !== -1) {
						errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Your code contains stuff that you can't use!").setColor(0x799bd0);
						message.channel.send({embed: errorembed})
						return
					}
					commands[guild.id][args[0]] = args[1].replace("\t", "    ")
					message.delete()
					createdembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription	("The code was set!" ).setColor(0x2eb081);
					message.channel.send({embed: createdembed})
					fs.writeFile("./commands.json", JSON.stringify(commands), (err) => {
						if (err) console.error(err)
					});
				}
				else {
					errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Please provide some code for the bot to run!").setColor(0x799bd0);
					message.channel.send({embed: errorembed})
					return
				}
			}
			else {
				message.delete()
				errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Command not found!").setColor(0x799bd0);
				message.channel.send({embed: errorembed})
				return
			}
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("You don't have the permission!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
	}

	if (command == botprefix + "showcode") {
		if (!message.member.roles.find(role => role.name === "CMDBotEditor") || message.author.username != "SealedKiller") {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("You don't have the permission!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
		if (commands[guild.id][args[0]]) {
			//codeembed = new Discord.RichEmbed().setTitle("Code for " + args[0])
			//.setDescription("```" + commands[guild.id][args[0]] + "```")
			message.channel.send("**Code for " + args[0]  + "**\n```" + commands[guild.id][args[0]] + "```")
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("Command not found!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
	}

	if (command == botprefix + "commands") {
		if (!message.member.roles.find(role => role.name === "CMDBotEditor") || message.author.username != "SealedKiller") {
			errorembed = new Discord.RichEmbed().setTitle("Command Manger").setDescription("You don't have the permission!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
		if (commands[message.guild.id]) {
			var keys = Object.keys(commands[guild.id]);
			cmdsembed = new Discord.RichEmbed().setTitle("Command List").setDescription("\n").setColor(0x8298eb);
			for(var i = 0; i < keys.length;i++){
				 //keys[i] for key
				cmdsembed.setDescription(cmdsembed.description + keys[i] + "\n")
   			//dictionary[keys[i]] for the value
			}
			cmdsembed.setDescription("`" + cmdsembed.description + "`")
			message.channel.send({embed: cmdsembed})
		}
		else {
			cmdsembed = new Discord.RichEmbed().setTitle("Command List").setDescription("None").setColor(0x8298eb);
			message.channel.send({embed: cmdsembed})
		}
	}
});

client.login('NDc5NzM3OTkyNTEzMTkxOTc4.Dldm1A.ajKgjCMc1fQUg-R34IoQwX3IOQc');

// invite link: https://discordapp.com/oauth2/authorize?client_id=479737992513191978&permissions=8&scope=bot
