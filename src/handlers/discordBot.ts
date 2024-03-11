import { Client, GatewayIntentBits, ChannelType, RoleMention } from 'discord.js';
import dotenv from 'dotenv';
import config from '../config/config'

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

export const sendMessageToChannel = async (channelId: string, message: string) => {
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.type === ChannelType.GuildText) {
        channel.send(message);
    }
};


export const initDiscordBot = () => {
    client.login(config.token);
};
