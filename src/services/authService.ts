/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import axios from "axios";
import qs from "qs";
import Configuration from "../config";

export default class AuthService {
  private accessToken: string;
  private authority: string;
  private authParams: any;
  private expiresAt: Date;

  constructor() {
    const config = Configuration.read();

    this.authority = config.Authority;
    this.authParams = {
      client_id: config.ClientId,
      client_secret: config.ClientSecret,
      grant_type: "client_credentials",
      scope: "webhooks:modify"
    };
  }

  public async getAccessToken(): Promise<string> {
    if (this.accessToken && this.expiresAt.getTime() > new Date().getTime()) return this.accessToken;

    try {
      const response = await axios({
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(this.authParams),
        url: `${this.authority}/connect/token`
      });

      if (response.status === 200) {
        this.accessToken = response.data["access_token"];

        const expirationTime = new Date();
        expirationTime.setSeconds(expirationTime.getSeconds() + response.data["expires_in"]);
        this.expiresAt = expirationTime;
        return this.accessToken;
      }
    } catch (err) {
      console.log("Failed to retrieve JWT access token.");
      console.log(err.response.data);
    }
  }
}
