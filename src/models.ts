/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

export interface Config {
  Authority: string;
  ApiUrl: string;
  AppUrl: string;
  ClientId: string;
  ClientSecret: string;
  IModelId: string;
  StorageConnectionString: string;
}

export type Event = {
  content: IModelDeletedEvent | NamedVersionCreatedEvent;
  contentType: string;
  enqueuedDateTime: string;
  messageId: string;
  subscriptionId: string;
};

export type IModelEvent = {
  imodelId: string;
  projectId: string;
};

export type IModelDeletedEvent = IModelEvent;

export type NamedVersionCreatedEvent = {
  changesetId: string;
  changesetIndex: string;
  versionId: string;
  versionName: string;
} & IModelEvent;

export type WebhookMap = {
  secret: string;
  webhookId: string;
};
