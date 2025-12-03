import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb } from '../utils/dynamo';
import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { apiResponse } from '../utils/response';
import { publishWSNoteNotifications } from '../utils/ws';

const deleteNoteFunction: HandlerType = async (event, userId) => {
  const noteId = event.pathParameters?.noteId;
  if (!noteId) return apiResponse.badRequest({ message: 'Missing noteId in the path' });

  await dynamodb.send(
    new DeleteCommand({
      TableName: process.env.NOTES_TABLE_NAME,
      Key: { userId, noteId },
    })
  );

  const connectionId = (event.headers['x-ws-connectionid'] || event.headers['X-Ws-Connectionid']) ?? '';

  await publishWSNoteNotifications(userId, connectionId, { action: 'note.deleted', data: noteId });
  return apiResponse.ok({ message: 'Note deleted' });
};

export const handler = lambdaWrapper(deleteNoteFunction);
