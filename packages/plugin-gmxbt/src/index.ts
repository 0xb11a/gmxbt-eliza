import { Plugin } from "@elizaos/core";

import showFundPortfolio from "./actions/showFundPortfolio";
import postFundPortfolio from "./actions/postFundPortfolio";
import GMXBTService from "./services/gmxbtService";

export const gmxbtPlugin: Plugin = {
  name: "gmxbt",
  description: "GMXBT Plugin for Eliza",
  actions: [postFundPortfolio, showFundPortfolio],
  evaluators: [],
  providers: [],
  services: [new GMXBTService()],
};

export default gmxbtPlugin;
