import { Client, Events } from "discord.js";
import config from "./utils/config";
import * as commandModules from "./commands";

const commands = Object(commandModules)

export const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "DirectMessages",
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "GuildVoiceStates",
    "GuildPresences",
    "GuildIntegrations",
    "GuildBans",
    "GuildInvites",
    "GuildWebhooks"
  ]
});

client.once("ready", () => {
  console.log("Ready!");
});




client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    try {
      commands[commandName].execute(interaction, client);
    }
    catch (e) {
      console.log(e);
    }
  };
});

client.login(config.DISCORD_TOKEN);