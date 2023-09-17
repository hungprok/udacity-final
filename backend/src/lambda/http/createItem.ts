import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateItemRequest } from "../../requests/CreateItemRequest";
import { getUserId } from "../utils";
import { createItem } from "../../helpers/items";
import { createLogger } from "../../utils/logger";

const logger = createLogger("createItem");
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newItem: CreateItemRequest = JSON.parse(event.body);
    const userId: string = getUserId(event);

    try {
      if (!newItem.name) {
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ msg: "Can not be blank!" }),
        };
      }
      const response = await createItem(newItem, userId);

      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          item: response,
        }),
      };
    } catch (err) {
      logger.error("Unable to complete the create item Operation for user", {
        userId: userId,
        error: err,
      });
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