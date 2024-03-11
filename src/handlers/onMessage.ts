import WebSocket from "ws";

import { MessageData, MessageEvent } from "@/types/events";

import { runtimeChannelData, matchesPattern, matchesForms } from "../utils/index";

import { RoleMention, roleMention } from "discord.js";

import { sendMessageToChannel } from '../handlers/discordBot'

import config from "../config/config";

let responseEvents: { [channelId: string]: number } = {};
let intervalId: NodeJS.Timeout;
const DURATION = 10; //seconds
const THIRTY_SECONDS = DURATION * 1000; // in milliseconds

/* const calculateAverage = () => {
  const averagePerChannel: { [channelId: string]: number } = {};
  // this needs to be changed to display channel name instead chatroom id
  for (const channelId in responseEvents) {
    const numEvents = responseEvents[channelId];
    const average = numEvents! / (THIRTY_SECONDS / 1000);
    averagePerChannel[channelId] = average;
  }

  for (const channelId in averagePerChannel) {
    const channelName = runtimeChannelData.get(Number(channelId.split(".")[1]));
    console.log(
      `🌟 Messages in #${channelName}: ${averagePerChannel[channelId]!.toFixed(
        2
      )} in the past ${DURATION} SECONDS`
    );
  }
  responseEvents = {};
}; */

// Parses chat message from WS events to read-able format without emotes
const messageParser = (message: string) => {
  const messageEventJSON: MessageEvent = JSON.parse(message);
  if (messageEventJSON.event === "App\\Events\\ChatMessageEvent") {
    const data: MessageData = JSON.parse(messageEventJSON.data);
    const message = data.content;
    const channelId = data.chatroom_id;
    const username = data.sender.username;
    // this regex detects emotes and removes the extra stuff only leaves the emote name/string
    const emoteRegex = /\[emote:\d+:[^\]]+\]/g;
    const channelName = runtimeChannelData.get(channelId);
    // this is only to display chat events in the command line
    try {
      // WARNING: this sometimes breaks, my guess is probably receiving gifted sub event
      if (message.match(emoteRegex)) {
        // const processedMsg = message.replace(emoteRegex)
        // emoteRegex, (match: string | undefined) => {
        //   const parts = match.substring(7, match.length - 1).split(":")
        //   return parts[1]
        // }
        const processedMsg = message.replace(emoteRegex, (match: any) => {
          const parts = match.substring(7, match.length - 1).split(":");
          return parts[1];
        });
        console.log(`${channelName} | ${username}: ${processedMsg}`);
      } else {
        console.log(`${channelName} | ${username}: ${message}`);
      }
    } catch (error) {
      console.log("Message filter error:", error);
    }
  }
};

export const onMessage = (messageEvent: WebSocket.Data) => {
  const message = messageEvent.toString();
  messageParser(message);
  /* sendMessageToChannel(config.dschannel, message) */

  /*   if (!intervalId) {
      intervalId = setInterval(calculateAverage, THIRTY_SECONDS);
    }
    eventCalculation(message); */
};

// Supongamos que quieres filtrar los mensajes de un usuario con username "UsuarioEjemplo"
const nombreDeUsuarioAFiltrar = "menuruxx";

// Acción específica a realizar basada en el mensaje filtrado
async function realizarAccionEspecifica(username: string, message: string,) {
  console.log(`Realizando una acción específica basada en el mensaje: ${message}`);
  /* const processedMessage = `${username}: ${message}` */
  /* sendMessageToChannel(config.dschannel, processedMessage) */

  if (matchesPattern(username, message)) {
    const processedMessage = `
    ${roleMention(config.codeRole)}
    ⚡CODIGO ${username}: ⚡
    \`${message}\`
    `
    sendMessageToChannel(config.dschannel, processedMessage)
  }

  if (matchesPattern(username, message)) {
    const processedMessage = `
    ${roleMention(config.codeRole)}
    ⚡CODIGO ${username}: ⚡
    \`${message}\`
    `
    sendMessageToChannel(config.dschannel, processedMessage)
  }

  if (matchesForms(message)) {
    const processedMessage = `
    
    Probabilidad alta de BONUSCALL ${username}: 
    \`${message}\`
    ||${roleMention(config.formRole)}||
    `
    sendMessageToChannel(config.dschannel, processedMessage)
  }

}

export const onMessageFiltrado = (messageEvent: WebSocket.Data) => {
  const message = messageEvent.toString();
  try {
    const messageEventJSON: MessageEvent = JSON.parse(message);
    if (messageEventJSON.event === "App\\Events\\ChatMessageEvent") {
      const data: MessageData = JSON.parse(messageEventJSON.data);
      // Verifica si el mensaje proviene del usuario que deseas filtrar
      if (data.sender.username === nombreDeUsuarioAFiltrar) {
        console.log(`Mensaje filtrado de ${nombreDeUsuarioAFiltrar}: ${data.content}`);
        // Aquí podrías llamar a realizarAccionEspecifica o cualquier otra lógica que necesites
        realizarAccionEspecifica(data.sender.username, data.content);
      }
    }
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
  }
};

function eventCalculation(message: string) {
  const messageEventJSON: MessageEvent = JSON.parse(message);
  if (messageEventJSON.event === "App\\Events\\ChatMessageEvent") {
    const channelId = messageEventJSON.channel;
    responseEvents[channelId] = (responseEvents[channelId] || 0) + 1;
  }
}
