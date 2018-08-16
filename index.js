const Discord = require('discord.js');
const music = require('discord.js-music');
const client = new Discord.Client();
const fs = require("fs");
let commandSave = JSON.parse(fs.readFileSync("./commands.json", "utf8"));

commands = {}

botprefix = "$"

client.on('ready', () => {
	console.log(`SBot Started!`);
	commands = commandSave
	client.guilds.forEach((guild) => {
		if (!commands[guild.id]) {
			commands[guild.id] = {}
		}
	});
});

client.on("guildCreate", guild => {
	console.log("Joined a new guild: " + guild.name);
	if (!commands[guild.id]) {
		commands[guild.id] = {}
	}
})

client.on("guildDelete", guild => {
	console.log("Left a guild: " + guild.name);
})

client.on('message', message => {
	if(message.author.bot) return;
	guild = message.guild
	msg_author = message.author
	var seperator = ";; "
	const argsN = message.content.split(/ +/g);
	const args = message.content.split(seperator);
	const command = argsN.shift();
	const parm = message.content.split(/ +/g).shift();
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
		createdembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Setup Complete!" ).setColor(0x2eb081);
			message.channel.send({embed: createdembed})
			return
	}

	if (commands[guild.id][command]) {
		embeds = {}
		function sendMessage(msg) {
			message.channel.send(msg)
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
		function storeParameter(varName, parameter) {
			eval(varName + " = argsN[" + parameter + "]") 
		}
		eval(commands[guild.id][command])
		return
	}

	//if (command == botprefix + "serverlist") {
		//message.channel.send(JSON.stringify(commands))
	//}
	if (command == botprefix + "help") {
		var codeMsg = "```"
		message.channel.send(`${codeMsg}\n$help                          Shows this menu.\n$addcommand <command>          Adds a command\n$deletecommand <command>       Deletes a command.\n$setcode <command>;; <code>    Sets the code.\n$showcode <command>            Shows the code of a command\n$commands                      Lists all the commands\n${codeMsg}`)
	}

	if (command == botprefix + "addcommand") {
		if (!commands[guild.id][args[0]]) {
			message.delete()
			commands[guild.id][args[0]] = "message.channel.send(\"No Code Found!\")"
			console.log("Command added: '" + args[0] + "' to guild: '" + guild + "' (" + guild.id + ")")
			createdembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Command `" + args[0] + "` created! set the code by using ```$setcode " + args[0] + ";; <code>```" ).setColor(0x2eb081);
			message.channel.send({embed: createdembed})
			fs.writeFile("./commands.json", JSON.stringify(commands), (err) => {
				if (err) console.error(err)
			});
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Command `" + args[0] + "` already exists!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
		}
	}

	if (command == botprefix + "deletecommand") {
		if (commands[guild.id][args[0]]) {
			delete commands[guild.id][args[0]]
			console.log("Command deleted: '" + args[0] + "' to guild: '" + guild + "' (" + guild.id + ")")
			createdembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Command `" + args[0] + "` was deleted" ).setColor(0xc46606);
			message.channel.send({embed: createdembed})
			fs.writeFile("./commands.json", JSON.stringify(commands), (err) => {
				if (err) console.error(err)
			});
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Command `" + args[0] + "` not found!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
		}
	}

	//if (command == botprefix + "evalcode") {
		//message.channel.send("Code: "+ args[0])
		//eval(args[0])
	//}

	if (command == botprefix + "setcode") {
		if (commands[guild.id][args[0]]) {
			if (args[1]) {
				if (args[1].indexOf("client.token") !== -1 || args[1].indexOf("client.destroy") !== -1 || args[1].indexOf("member.addRole") !== -1 || args[1].indexOf("member.kick") !== -1 || args[1].indexOf("member.ban") !== -1) {
					errorembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Your code contains stuff that you can't use!").setColor(0x799bd0);
					message.channel.send({embed: errorembed})
					return
				}
				commands[guild.id][args[0]] = args[1].replace("\t", "    ")
				message.delete()
				createdembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription	("The code was set!" ).setColor(0x2eb081);
				message.channel.send({embed: createdembed})
				fs.writeFile("./commands.json", JSON.stringify(commands), (err) => {
					if (err) console.error(err)
				});
			}
			else {
				errorembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Please provide some code for the bot to run!").setColor(0x799bd0);
				message.channel.send({embed: errorembed})
				return
			}
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Command not found!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
	}

	if (command == botprefix + "showcode") {
		if (commands[guild.id][args[0]]) {
			//codeembed = new Discord.RichEmbed().setTitle("Code for " + args[0])
			//.setDescription("```" + commands[guild.id][args[0]] + "```")
			message.channel.send("**Code for " + args[0]  + "**\n```" + commands[guild.id][args[0]] + "```")
		}
		else {
			errorembed = new Discord.RichEmbed().setTitle("CMD Bot").setDescription("Command not found!").setColor(0x799bd0);
			message.channel.send({embed: errorembed})
			return
		}
	}

	if (command == botprefix + "commands") {
		if (commands) {
			var keys = Object.keys(commands[guild.id]);
			
			cmdsembed = new Discord.RichEmbed().setTitle("Command List").setDescription("\n").setColor(0x8298eb);
			for(var i = 0; i < keys.length;i++){
				 //keys[i] for key
				cmdsembed.setDescription("`" + cmdsembed.description + keys[i] + "`\n")
   			//dictionary[keys[i]] for the value
			}
			cmdsembed.setDescription(cmdsembed.description)
			message.channel.send({embed: cmdsembed})
		}
		else {
			cmdsembed = new Discord.RichEmbed().setTitle("Command List").setDescription("None").setColor(0x8298eb);
			message.channel.send({embed: cmdsembed})
		}
	}
});

client.login('NDc3MjEyMTY1MTc0OTg0NzE0.DlbzFg.Glg6DlJWKaCLAI9GuouPbQ8R0w0');
