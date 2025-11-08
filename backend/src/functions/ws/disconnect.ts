import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketHandlerV2,
} from 'aws-lambda';
import { apiResponse } from '../../utils/response';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { connectionId } = event.requestContext;
  console.log({ connectionId, handler: 'disconnect' });

  return apiResponse.ok('disconnected');
};
