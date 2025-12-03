import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { apiResponse } from '../utils/response';
import { dynamodb } from '../utils/dynamo';
import { noteSchema } from '../schema/note';
import { publishWSNoteNotifications } from '../utils/ws';

const updateNoteFunction: HandlerType = async (event, userId) => {
  const noteId = event.pathParameters?.noteId;
  if (!noteId) return apiResponse.badRequest({ message: 'Missing noteId in the path' });

  const body = event.body ? JSON.parse(event.body) : {};
  const data = noteSchema.partial().parse(body);

  const updateExpression: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    updateExpression.push(`#${key} = :${key}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = value;
  });

  const updateCommand = new UpdateCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    Key: { noteId, userId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW', // Optional
  });

  const result = await dynamodb.send(updateCommand);

  const connectionId = (event.headers['x-ws-connectionid'] || event.headers['X-Ws-Connectionid']) ?? '';
  await publishWSNoteNotifications(userId, connectionId, { action: 'note.updated', data: result.Attributes });

  return apiResponse.ok({ message: 'Note updated', note: result.Attributes });
};

export const handler = lambdaWrapper(updateNoteFunction);
