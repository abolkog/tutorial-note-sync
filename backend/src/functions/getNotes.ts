import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  console.log({ event });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello from Get Notes' }),
  };
};
