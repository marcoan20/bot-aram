const { REST, Routes } = require('discord.js');
import config from "./config"; //importa o arquivo de configuração
import * as commandModules from "../commands"; // importa todos os comandos
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

interface Command {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (interaction: any) => Promise<void>;
}
// Adiciona os comandos ao array commands
for(const module of Object.values<Command>(commandModules)) {
  commands.push(module.data);
}

// Cria o cliente REST
const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

// Registra os comandos
rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commands })
.then(() => console.log('Successfully registered application commands.'))
.catch(console.error);