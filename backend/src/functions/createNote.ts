import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';

const createNotesFunction: HandlerType = async (event, userId) => {
  console.log({ event });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello from Create Note' }),
  };
};

export const handler = lambdaWrapper(createNotesFunction);
