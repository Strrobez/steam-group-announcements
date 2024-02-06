import IConfiguration, { IServer } from "./config";
const config: IConfiguration = require("./config.json");

import consola from "consola";

import { CronJob } from "cron";
import parser from "cron-parser";

import Steam from "steamcommunity";
import SteamTotp from "steam-totp";

const steam = new Steam();

(async () => {
  steam.login(
    {
      accountName: config.steam.username,
      password: config.steam.password,
      twoFactorCode: SteamTotp.generateAuthCode(config.steam.sharedSecret),
    },
    (err: Steam.CallbackError) => {
      if (err) return consola.error(err);

      consola.success("[Steam] Logged in as:", steam.steamID.getSteamID64());

      config.servers.forEach((server: IServer) => {
        if (!isStringArray(server.crontabs))
          server.crontabs = [server.crontabs];

        server.crontabs.forEach((crontab: string, idx: number) => {
          const nextWipe: string = parser
            .parseExpression(crontab)
            .next()
            .toISOString();

          const formattedDate: string = new Date(nextWipe).toUTCString();

          consola.info(
            `[${idx}] ${server.name}'s next announcement will be at ${formattedDate}. (2 Hour Reminder Enabled?: ${server.reminder})`
          );

          const job = new CronJob(
            crontab,
            () => serverWipe(server),
            null,
            true,
            "UTC"
          );
          job.start();
        });
      });
    }
  );
})();

const serverWipe = (server: IServer) => {
  createAnnouncement(
    `${server.name} WIPED`,
    `Server IP: connect ${server.connect}`
  );

  setTimeout(() => {}, 2000);

  if (server.reminder) reminderWipe(server);
};

const reminderWipe = (server: IServer) => {
  const reminderCron: string = "0 0 2 * * *";
  const nextWipe: string = parser
    .parseExpression(reminderCron)
    .next()
    .toISOString();
  const formattedDate: string = new Date(nextWipe).toUTCString();

  consola.info(
    `[${server.name}] Next 2 Hour Reminder will be at ${formattedDate}.`
  );

  const job = new CronJob(
    reminderCron,
    () => {
      createAnnouncement(
        `${server.name} WIPED 2 HOURS AGO`,
        `Server IP: connect ${server.connect}`
      );
    },
    null,
    true,
    "UTC"
  );

  job.start();
};

const createAnnouncement = (title: string, text: string) => {
  steam.postGroupAnnouncement(
    config.steam.groupId,
    title,
    text,
    false,
    (err: Steam.CallbackError) => {
      if (err) return consola.error(err);

      consola.success(`New Announcement posted: ${title}`);
    }
  );
};

const isStringArray = (value: any): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};
