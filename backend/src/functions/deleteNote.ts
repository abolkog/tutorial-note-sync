import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb } from '../utils/dynamo';
import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { apiResponse } from '../utils/response';

const deleteNoteFunction: HandlerType = async (event, userId) => {
  const noteId = event.pathParameters?.noteId;
  if (!noteId) return apiResponse.badRequest({ message: 'Missing noteId in the path' });

  await dynamodb.send(
    new DeleteCommand({
      TableName: process.env.NOTES_TABLE_NAME,
      Key: { userId, noteId },
    })
  );
  return apiResponse.ok({ message: 'Note deleted' });
};

export const handler = lambdaWrapper(deleteNoteFunction);
