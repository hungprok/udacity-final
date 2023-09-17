import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { updateItem, getItemsForUser } from "../../helpers/items";
import { getUserId } from "../utils";
import { UpdateItemRequest } from "../../requests/UpdateItemRequest";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const itemId = event.pathParameters.itemId;
    const updateItemRequest: UpdateItemRequest = JSON.parse(event.body);
    try {
      await updateItem(itemId, getUserId(event), updateItemRequest);
      const items = await getItemsForUser(getUserId(event));
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          items: items.Items,
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: err,
        }),
      };
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);