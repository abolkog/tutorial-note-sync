import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb } from '../utils/dynamo';
import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { apiResponse } from '../utils/response';

const getNoteFunction: HandlerType = async (event, userId) => {
  const noteId = event.pathParameters?.noteId;

  if (!noteId) return apiResponse.badRequest({ message: 'Missing noteId in the path' });

  const { Item } = await dynamodb.send(
    new GetCommand({
      TableName: process.env.NOTES_TABLE_NAME,
      Key: {
        userId,
        noteId,
      },
    })
  );

  if (!Item) return apiResponse.notFound('Note not found');

  return apiResponse.ok({ data: Item });
};
export const handler = lambdaWrapper(getNoteFunction);
