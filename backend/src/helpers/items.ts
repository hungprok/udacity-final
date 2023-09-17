import { DbAccess } from "./dbAcess";
import { AttachmentUtils } from "./attachmentUtils";
import { Item } from "../models/Item";
import { CreateItemRequest } from "../requests/CreateItemRequest";
import { UpdateItemRequest } from "../requests/UpdateItemRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import { ItemUpdate } from "../models/ItemUpdate";

const dbAccess: DbAccess = new DbAccess();
const attachmentUtils = new AttachmentUtils();
const logger = createLogger("businessLayerLogger");
export async function getItemsForUser(userId: string) {
  try {
    let items = await dbAccess.getItemList(userId);
    return items;
  } catch (err) {
    logger.error("Unable to get list of items", {
      userId,
      error: err,
    });
    return err;
  }
}

export async function getItemById(userId: string, itemId: string) {
  try {
    let item = await dbAccess.getItemById(itemId, userId);
    return item;
  } catch (err) {
    return err;
  }
}

export async function createItem(
  itemRequest: CreateItemRequest,
  userId: string
) {
  const itemId = uuid.v4();
  const item: Item = {
    userId: userId,
    itemId: itemId,
    createdAt: new Date().toLocaleString(),
    name: itemRequest.name,
    price: itemRequest.price,
    description: itemRequest.description

  };

  try {
    await dbAccess.insertItem(item);
    return item;
  } catch (err) {
    logger.error("Unable to save Item", {
      methodName: "createItem",
      userId,
      error: err,
    });
    return err;
  }
}

export async function updateItem(
  itemId: string,
  userId: string,
  updatedItem: UpdateItemRequest
) {
  const itemUpdate: ItemUpdate = {
    ...updatedItem,
  };

  try {
    await dbAccess.updateItem(itemId, userId, itemUpdate);
  } catch (err) {
    return err;
  }
}

export async function deleteItem(itemId: string, userId: string) {
  try {
    await dbAccess.deleteItem(itemId, userId);
  } catch (err) {
    return err;
  }
}

export async function createAttachmentPresignedUrl(
  itemId: string,
  userId: string
) {
  try {
    const imageId = uuid.v4();
    let url = await attachmentUtils.generateSignedUrl(imageId);
    await dbAccess.updateItemAttachmentUrl(itemId, userId, imageId);
    return url;
  } catch (err) {
    logger.error("Unable to update Item attachment Url", {
      methodName: "createAttachmentPresignedUrl",
      userId,
      error: err,
    });
    return err;
  }
}