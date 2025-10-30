import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log({ event });
  const noteId = event.pathParameters?.noteId;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello from Delete Note', noteId }),
  };
};
