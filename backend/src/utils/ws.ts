import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { dynamodb } from './dynamo';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

const CALLBACK_URL = process.env.WEBSOCKET_CALLBACK_URL;
const CONNECTION_TABLE_NAME = process.env.CONNECTION_TABLE_NAME;

const mgmApi = new ApiGatewayManagementApiClient({ endpoint: CALLBACK_URL });

type WSMessage = {
  action: 'registered' | 'note.created' | 'note.updated' | 'note.deleted';
  data: unknown;
};

export async function sendAck(connectionId: string) {
  await mgmApi.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({ action: 'registered', data: { connectionId } }),
    })
  );
}

export async function publishWSNoteNotifications(userId: string, connectionId: string, message: WSMessage) {
  // Query dynamo to get all user connections
  console.log('Excluding ', connectionId);
  const result = await dynamodb.send(
    new QueryCommand({
      TableName: CONNECTION_TABLE_NAME,
      IndexName: 'byUser',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'connectionId <> :connectionId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':connectionId': connectionId,
      },
    })
  );

  const items = result.Items ?? [];

  // Loop and notify
  for (const item of items) {
    try {
      const connectionId = item.connectionId;
      await mgmApi.send(
        new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify(message),
        })
      );
    } catch (e) {
      console.error('Failed to publish notifications', e);
    }
  }
}
