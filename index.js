const { Client, Collection, WebhookClient, MessageEmbed, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
    intents:
     [
           GatewayIntentBits.Guilds,
           GatewayIntentBits.GuildMembers,
           GatewayIntentBits.GuildEmojisAndStickers,
           GatewayIntentBits.GuildIntegrations,
           GatewayIntentBits.GuildWebhooks,
           GatewayIntentBits.GuildInvites,
           GatewayIntentBits.GuildVoiceStates,
           GatewayIntentBits.GuildPresences,
           GatewayIntentBits.GuildMessages,
           GatewayIntentBits.GuildMessageReactions,
           GatewayIntentBits.GuildMessageTyping,
           GatewayIntentBits.DirectMessages,
           GatewayIntentBits.DirectMessageReactions,
           GatewayIntentBits.DirectMessageTyping,
           GatewayIntentBits.MessageContent],
           shards: "auto",
           partials:
          [
          Partials.Message,
          Partials.Channel,
          Partials.GuildMember,
          Partials.Reaction, Partials.GuildScheduledEvent,
          Partials.User,
          Partials.ThreadMember
        ]});
        module.exports = client;

        const Discord = require("discord.js");
        const fs = require("fs");
        const Path = require("path");
        const config = require("./config/config")
        const { exampleFunction } = require('./functions/anti-ping');
    
        client.commands = global.commands = new Discord.Collection();
        const synchronizeSlashCommands = require('discord-sync-commands-v14');
        
        const eventsRegister = () => {
            let eventsDir = Path.resolve(__dirname, './events');
            if (!fs.existsSync(eventsDir)) return console.log("No events dir");
            fs.readdirSync(eventsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((event) => {
                let prop = require(`./events/${event}`);
                if (!prop) return console.log("No props.");
                console.log(`${event} was saved.`);
                client.on(event.split('.')[0], prop.bind(null, client));
                delete require.cache[require.resolve(`./events/${event}`)];
            });
        };
        
        const commandsRegister = () => {
          let commandsDir = Path.resolve(__dirname, './commands');
          if (!fs.existsSync(commandsDir)) return console.log("No events dir.");
          fs.readdirSync(commandsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((command) => {
              let prop = require(`./commands/${command}`);
              if (!prop || !prop.options || !prop.options.name) return console.log("Invalid command file.");
              console.log(`${command} command saved`);
              client.commands.set(prop.options.name, prop);
              delete require.cache[require.resolve(`./commands/${command}`)];
          });
        };
        
    
        const slashCommandsRegister = () => {
            const commands = client.commands.filter((c) => c.options);
            const fetchOptions = { debug: true };
            synchronizeSlashCommands(client, commands.map((c) => c.options), fetchOptions);
        };
        
        eventsRegister();
        commandsRegister();
        slashCommandsRegister()
        
        process.on('unhandledRejection', error => {
            console.log(error);
        
        });

/////////////////////////////////////////* NOTIFY VERIOS */////////////////////////////////////////
  let currentVersion = null;
  const webhookUrl = "https://discord.com/api/webhooks/1094037349211590685/klrB40WCF4Y2dXdUdUAvLcteXjaQzUHgzUkbUuSizAhHivlhtpA8larQ0k-hZUt5tGc7" 

  function sendNotification(version) {
    const currentVersion = {
      content: '<@948916911293497344>, ROBLOX Update Notification',
      embeds: [
        {
          title: 'Version ' + version + ' is now available!',
          color: 0x0099ff,
          thumbnail: {
            url: 'https://images.drivereasy.com/wp-content/uploads/2021/07/2021-07-15_10-10-07.jpg',
          },
        },
      ],
    };

    const fs = require('fs');
    fs.appendFile('database.txt', version + '\n', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Version added to database');
    });

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentVersion),
    })
      .then(() => {
        console.log(`Sent notification for version ${version}`);
      })
      .catch((error) => {
        console.error(error);
      });
    }

  function checkVersion() {
    fetch('https://api.whatexploitsare.online/status')
      .then((response) => response.json())
      .then((data) => {
        const roblox = data.find((item) => item.hasOwnProperty('ROBLOX'));
  
        if (roblox && roblox.ROBLOX.version !== currentVersion) {
          currentVersion = roblox.ROBLOX.version;
          sendNotification(currentVersion);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  checkVersion();
  setInterval(checkVersion, 60 * 60 * 1000);
  /////////////////////////////////////////* NOTIFY VERIOS */////////////////////////////////////////


client.login(config.token)
