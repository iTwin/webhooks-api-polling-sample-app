/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import { QueueClient, QueueServiceClient } from "@azure/storage-queue";
import Configuration from "../config";
import { Event } from "../models";

export default class QueueService {
  private queueClient: QueueClient;
  private queueName: string = "event-queue";

  constructor() {
    const config = Configuration.read();
    this.initializeQueue(this.queueName, config.StorageConnectionString).then((client) => (this.queueClient = client));
  }

  public async capture(event: string): Promise<void> {
    await this.queueClient.sendMessage(event);
  }

  public async pull(): Promise<Event[]> {
    const result: Event[] = [];
    const messages = await this.queueClient.receiveMessages();

    messages.receivedMessageItems.forEach((item) => {
      result.push(JSON.parse(item.messageText) as Event);
      this.queueClient.deleteMessage(item.messageId, item.popReceipt);
    });

    return result;
  }

  private async initializeQueue(queueName: string = this.queueName, connectionString: string): Promise<QueueClient> {
    const serviceClient = QueueServiceClient.fromConnectionString(connectionString);
    const client = serviceClient.getQueueClient(queueName);
    await client.createIfNotExists();

    return client;
  }
}
