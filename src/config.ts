/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import dotenv from "dotenv";
import { Config } from "./models";

export default class Configuration {
  private static config: Config;

  static read(): Config {
    if (!this.config) this.config = this.load();
    return this.config;
  }

  private static load(): Config {
    dotenv.config();

    if (!process.env.API_URL)
      throw new Error("Missing configuration value for API_URL. Set it to https://api.bentley.com/");

    if (!process.env.APP_URL)
      throw new Error("Missing configuration value for APP_URL. Populate it with your application URL.");

    if (!process.env.IMODEL_ID)
      throw new Error(
        "Missing configuration value for IMODEL_ID. You can create your iModel at https://developer.bentley.com/my-imodels/"
      );

    if (!process.env.OAUTH_AUTHORITY)
      throw new Error("Missing configuration value for OAUTH_AUTHORITY. Set it to https://ims.bentley.com");

    if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET)
      throw new Error(
        "Missing configuration value for OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET. You can create your application at https://developer.bentley.com/register/"
      );

    if (!process.env.STORAGE_CONNECTION_STRING)
      throw new Error(
        "Missing configuration value for STORAGE_CONNECTION_STRING. Please create your storage account in Azure and provide the connection string."
      );

    return {
      Authority: process.env.OAUTH_AUTHORITY,
      ApiUrl: process.env.API_URL,
      AppUrl: process.env.APP_URL,
      ClientId: process.env.OAUTH_CLIENT_ID,
      ClientSecret: process.env.OAUTH_CLIENT_SECRET,
      IModelId: process.env.IMODEL_ID,
      StorageConnectionString: process.env.STORAGE_CONNECTION_STRING
    };
  }
}
