const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  if(err) console.log("Nem írtad át a tokenfile.json fájlban a tokent!")
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Nem találtam parancsokat!");
    console.log
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} betöltve!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} elérhető ${bot.guilds.size} szerveren!`);
  console.log(`Bejelentkeztem mint ${bot.user.tag}`);

  bot.user.setActivity("Commands | 2.0 :D", {type: "STREAMING"});

  let activNum = 0;

  setInterval(function() {
    if (activNum === 0) {
      bot.user.setActivity("Fejlesztés alatt..", {type: "PLAYING"});
      activNum = 1;
    } else if (activNum === 1) {
      
      bot.user.setActivity("Parancsok átírása..", {type: "STREAMING"});
      activNum = 0;

    }
  }, 7 * 1000);

});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let blacklisted = ['kurva', 'discord.gg', 'idiota', 'kurvaanyad', 'kocsog','köcsög', 'idióta', 'kurvaanyád', 'fasszopó', 'fasszopo', 'fasszopó', 'faszopo', 'nyomorék', 'nyomorek', 'class', 'Class', 'fay', 'Fay'];


  let tiltottszoembed = new Discord.RichEmbed()

  .setDescription("Tiltott szavakat használtál!")
  .addField("Ez a szó tiltva van!","Kérlek hanyagold ezen szó használatát és nem lesz semmi baj!")
  .setColor("#B92700");

  let foundInText = false;
  for (var i in blacklisted){
  if(message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
  }

  if (foundInText) {
    message.author.send(tiltottszoembed);
    message.delete().catch(O_o=>{});
  }

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

  
});



bot.login(tokenfile.token);
