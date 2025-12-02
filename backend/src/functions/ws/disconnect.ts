import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketHandlerV2,
} from 'aws-lambda';
import { apiResponse } from '../../utils/response';
import { dynamodb } from '../../utils/dynamo';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const CONNECTION_TABLE_NAME = process.env.CONNECTION_TABLE_NAME;

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { connectionId } = event.requestContext;
  await dynamodb.send(
    new DeleteCommand({
      TableName: CONNECTION_TABLE_NAME,
      Key: { connectionId },
    })
  );

  return apiResponse.ok('disconnected');
};
