import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { verifyUserId } from './auth';
import { AuthError } from './customErrors';

export type HandlerType = (event: APIGatewayProxyEventV2, userId: string) => Promise<APIGatewayProxyResultV2>;

export const lambdaWrapper = (handler: HandlerType): APIGatewayProxyHandlerV2 => {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    let userId: string;

    try {
      userId = verifyUserId(event);
      return await handler(event, userId);
    } catch (e) {
      if (e instanceof AuthError) {
        return {
          statusCode: e.statusCode,
          body: JSON.stringify({ message: e.message }),
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };
};
