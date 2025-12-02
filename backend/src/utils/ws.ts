import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

const CALLBACK_URL = process.env.WEBSOCKET_CALLBACK_URL;

const mgmApi = new ApiGatewayManagementApiClient({ endpoint: CALLBACK_URL });

export async function sendAck(connectionId: string, userId: string) {
  await mgmApi.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({ action: 'registered', userId, connectionId }),
    })
  );
}
