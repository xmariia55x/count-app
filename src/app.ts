import { existsSync } from "node:fs";

import express, { NextFunction, Request, Response } from "express";
import _ from "lodash";

import config from "./config";
import { loadData, exportData } from "./utils/files";

export default function createServer(redis): express.Application {
  const expressApp = express();
  expressApp.use(express.json());

  const fileName = config.file;

  expressApp.get("/health", (_, res: Response) => res.sendStatus(200));

  expressApp.get("/count", async (_, res: Response) => {
    const count = await redis.getData("count");
    const actualCount = parseInt(count);

    let message = "";
    if (!isNaN(actualCount)) {
      message += `Current count is ${actualCount}`;
    } else {
      message += "Count key was not found on Redis";
    }

    console.log(message);

    res.send(message);
  });

  expressApp.post("/track", async (req: Request, res: Response) => {
    const data = req.body;
    let message = "";

    if (!_.isEmpty(data) && typeof data == "object") {
      let existingData = {};
      if (existsSync(fileName)) {
        existingData = await loadData(fileName);
      }

      const mergedData = { ...existingData, ...data };
      exportData(fileName, mergedData);

      if (data.count) {
        const count = await redis.getData("count");
        const actualCount = parseInt(count);
        const redisCount = !isNaN(actualCount) ? actualCount : 0;
        const totalAmount = parseInt(data.count) + redisCount;

        redis.storeData("count", totalAmount);
        message += "data was stored into Redis DB";
      } else {
        message +=
          "data could not be stored into Redis DB since it does not include a count key";
      }

      message += " and written to a local file";
    } else {
      message += "Data must be a valid JSON object";
    }

    console.log(message);

    res.send(message);
  });

  expressApp.use("*", (req: Request, res: Response, next: NextFunction) => {
    try {
      const errorMessage = "You requested an endpoint that does not exist.";
      const error = new Error(errorMessage);
      res.sendStatus(404);
      throw error;
    } catch (err) {
      next(err);
    }
  });

  return expressApp;
}
