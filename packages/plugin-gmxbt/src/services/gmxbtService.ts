import cron from "node-cron";

import { elizaLogger, IAgentRuntime, Service, ServiceType } from "@elizaos/core";

// export interface IGMXBTService {
//   runCron(): Promise<void>;
// }

declare module "@elizaos/core" {
  export enum ServiceType {
    GMXBT = "gmxbt",
  }
}

class GMXBTService extends Service {
  private runtime: IAgentRuntime | null = null;

  static get serviceType(): ServiceType {
    return ServiceType.GMXBT;
  }

  get serviceType(): ServiceType {
    return ServiceType.GMXBT;
  }

  private static isInitialized = false;

  async initialize(_runtime: IAgentRuntime): Promise<void> {
    if (GMXBTService.isInitialized) {
      return;
    }

    this.runtime = _runtime;
    this.runCron();
    GMXBTService.isInitialized = true;

    elizaLogger.log("TwitterPostJobService initialize");
  }

  async runCron(): Promise<void> {
    cron.schedule("* */3 * * *", async () => {
      elizaLogger.log("Run updatePortfolioTweet at", new Date().toUTCString());
      await this.updatePortfolioTweet();
    });

    elizaLogger.log("TwitterPostJobService cron has been started");
  }

  async updatePortfolioTweet(): Promise<void> {
    const twitterClient = this.runtime?.clients?.twitter;

    if (!twitterClient) {
      return;
    }

    const agentId = this.runtime.agentId;

    try {
      const url = "http://localhost:3000/" + agentId + "/message";
      const body = JSON.stringify({
        text: "Post the fund portfolio for gmxbt",
        userId: "user-fund-update-twitter",
        roomId: "default-room-twitter-cron-" + agentId,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Update Portfolio response", responseData);
    } catch (error) {
      elizaLogger.error("Error updating portfolio twitter", error);
    }
  }
}

export default GMXBTService;
