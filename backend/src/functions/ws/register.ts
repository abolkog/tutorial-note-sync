import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyWebsocketHandlerV2,
} from 'aws-lambda';
import { apiResponse } from '../../utils/response';
import { dynamodb } from '../../utils/dynamo';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { sendAck } from '../../utils/ws';

const CONNECTION_TABLE_NAME = process.env.CONNECTION_TABLE_NAME;

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2) => {
  const { connectionId } = event.requestContext;

  // Check userID
  const body = event.body ? JSON.parse(event.body) : {};
  const userId = body?.userId;
  if (!userId) return apiResponse.badRequest('Missing userId from request body');

  // Update Dynamo Table
  try {
    await dynamodb.send(
      new UpdateCommand({
        TableName: CONNECTION_TABLE_NAME,
        Key: { connectionId },
        UpdateExpression: 'SET userId = :uid, updatedAt = :ts',
        ExpressionAttributeValues: {
          ':uid': userId,
          ':ts': new Date().toISOString(),
        },
      })
    );

    // Ack Message
    await sendAck(connectionId, userId);

    return apiResponse.ok('registered');
  } catch (e) {
    console.error(e);
    return apiResponse.badRequest('Invalid userId');
  }
};
