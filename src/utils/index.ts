import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { KickChannelInfo } from "@/types/channels";

// this is a runtime solution since you should be persisting this data in db
export const runtimeChannelData = new Map<number, string>();

export const getChannelData = async (channel: string) => {
  const puppeteerExtra = puppeteer.use(StealthPlugin()) as typeof puppeteer;
  const browser = await puppeteerExtra.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(`https://kick.com/api/v2/channels/${channel}`);
  await page.waitForSelector("body");
  try {
    const jsonContent: KickChannelInfo = await page.evaluate(() => {
      const bodyElement = document.querySelector("body");
      const bodyText = bodyElement ? bodyElement.textContent : null;
      return bodyText ? JSON.parse(bodyText) : null;
    });
    await browser.close();
    runtimeChannelData.set(jsonContent.chatroom.id, jsonContent.slug);
    return jsonContent;
  } catch (err: any) {
    throw err;
  }
};

export const getChatroomId = async (channels: string[]) => {
  let chatroomIds: number[] = [];
  for (const channel of channels) {
    const channelData = await getChannelData(channel);
    const chatRoomId = channelData.chatroom.id;
    chatroomIds.push(chatRoomId);
  }
  return chatroomIds;
};


export function matchesPattern(user: string, text: string) {
  /* user = "1" */
  const regex = new RegExp(`\\b${user}[a-zA-Z]{2}\\d{2}[a-zA-Z]{2}\\b`);
  /* console.log(regex) */
  return regex.test(text);
}



export function matchesForms(text: string) {
  const regex = /\bhttps:\/\/forms.gle\/\b/;
  return regex.test(text);
}

export const names = ["Antaurus", "menuruxx", "lepajee", "frankkaster"];


// Example usage:
/* console.log(matchesForms("https://forms.gle/ZkFmUC3mMzCMfqmdA")); // true */
/* console.log(matchesPattern("lepajeezz34xy")); // true
console.log(matchesPattern("lepajee1234")); // false, because it doesn't end with two letters
console.log(matchesPattern("randomlepajeeab12cd")); // false, because it doesn't start with "lepajee" at a word boundary
 */