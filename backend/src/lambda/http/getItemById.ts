import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getItemById } from "../../helpers/items";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("getItemById");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const itemId = event.pathParameters.itemId;
    logger.info(`userId: ${getUserId(event)} itemId: ", ${itemId}`
    )
    try {
      const item = await getItemById(getUserId(event), itemId);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          item: item.Items ? item.Items[0] : {},
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