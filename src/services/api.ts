/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import axios from "axios";
import AuthService from "./authService";
import Configuration from "../config";
import { Config, WebhookMap } from "../models";

// Class for consuming iTwin Platform APIs
export default class Api {
  private authService: AuthService;
  private config: Config;

  constructor() {
    this.authService = new AuthService();
    this.config = Configuration.read();
  }

  public async createIModelEventWebhook(
    imodelId: string,
    callbackUrl: string,
    eventTypes: string[]
  ): Promise<WebhookMap> {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30);

    const requestBody = {
      imodelId,
      callbackUrl,
      eventTypes,
      expirationDateTime: expiration.toISOString()
    };

    try {
      var response = await axios({
        method: "POST",
        headers: {
          Authorization: "Bearer " + (await this.authService.getAccessToken())
        },
        data: requestBody,
        url: `${this.config.ApiUrl}/webhooks/imodels`
      });

      const location = response.headers["location"] as string;

      const [webhookId] = location.split("/").slice(-1);
      const secret = response.data["webhook"]["secret"] as string;

      console.log(`Created new webhook (ID: ${webhookId})`);
      return { secret, webhookId };
    } catch (err) {
      console.log("Could not create a webhook.");
      console.log(err.response.data);
    }
  }
}
