import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { Item } from "../models/Item";
import { ItemUpdate } from "../models/ItemUpdate";

const client = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB({
    region: "us-east-1",
  }),
  region: "us-east-1",
});

AWSXRay.captureAWSClient((client as any).service);

const logger = createLogger("ItemsAccess");

export class DbAccess {
  constructor(
    private readonly docClient: DocumentClient = client,
    private readonly itemsTable: string = process.env.ITEMS_TABLE,
    private readonly itemsTableIndex: string = process.env.ITEMS_CREATED_AT_INDEX
  ) { }

  async getItemList(userId: string) {
    const params = {
      TableName: this.itemsTable,
      IndexName: this.itemsTableIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    try {
      return await this.docClient.query(params).promise();
    } catch (err) {
      logger.error("Unable to get Items from database", {
        methodName: "itemsAccess.getItemList",
        userId,
        error: err,
      });
      return err;
    }
  }

  async getItemById(itemId: string, userId: string) {
    var params = {
      TableName: this.itemsTable,
      KeyConditionExpression: "userId = :userId AND itemId = :itemId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":itemId": itemId
      },
    };
    try {
      return await this.docClient.query(params).promise();
    } catch (err) {
      logger.error("Unable to getItemById in database", {
        methodName: "itemsAccess.getItemById",
        itemId: itemId,
        error: err,
      });
      return err;
    }
  }

  async insertItem(item: Item) {
    let input = {
      userId: item.userId,
      itemId: item.itemId,
      createdAt: item.createdAt,
      sold: false,
      name: item.name,
      price: item.price,
      description: item.description
    };
    const params: DocumentClient.PutItemInput = {
      TableName: this.itemsTable,
      Item: input,
    };

    try {
      await this.docClient.put(params).promise();
    } catch (err) {
      logger.error("Unable to insertItem into database", {
        methodName: "itemsAccess.insertItem",
        itemId: item.itemId,
        error: err,
      });
      return err;
    }
  }

  async updateItem(
    itemId: string,
    userId: string,
    updatedItem: ItemUpdate
  ) {
    const { name, soldDate, sold, description, price } = updatedItem
    const params = {
      TableName: this.itemsTable,
      Key: {
        itemId,
        userId,
      },
      UpdateExpression: "set #nm = :name, soldDate = :soldDate, sold = :sold, description = :description, price = :price",
      ExpressionAttributeNames: { "#nm": "name" },
      ExpressionAttributeValues: {
        ":name": name,
        ":soldDate": soldDate,
        ":sold": sold,
        ":description": description,
        ":price": price
      },
    };
    try {
      await this.docClient
        .update(params, function (err) {
          if (err) {
            console.log(err);
          }
        })
        .promise();
    } catch (err) {
      logger.error("Unable to updateItem in database", {
        methodName: "itemsAccess.updateItem",
        itemId: itemId,
        error: err,
      });
      return err;
    }
  }

  async deleteItem(itemId: string, userId: string) {
    var params = {
      TableName: this.itemsTable,
      Key: {
        userId,
        itemId,
      },
    };
    try {
      await this.docClient
        .delete(params, function (err) {
          if (err) {
            console.log(err);
          }
        })
        .promise();
    } catch (err) {
      logger.error("Unable to deleteItem in database", {
        methodName: "itemsAccess.deleteItem",
        itemId: itemId,
        error: err,
      });
      return err;
    }
  }

  async updateItemAttachmentUrl(
    itemId: string,
    userId: string,
    imageId: string
  ) {
    const params = {
      TableName: this.itemsTable,
      Key: {
        itemId,
        userId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${imageId}`,
      },
    };
    try {
      await this.docClient
        .update(params, function (err) {
          if (err) {
            console.log(err);
          }
        })
        .promise();
    } catch (err) {
      logger.error("Unable to updateItemAttachmentUrl in database", {
        methodName: "itemsAccess.updateItemAttachmentUrl",
        itemId: itemId,
        error: err,
      });
      return err;
    }
  }
}