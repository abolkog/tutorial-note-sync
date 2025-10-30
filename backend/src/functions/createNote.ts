import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'ap-southeast-2' });
const docClient = DynamoDBDocumentClient.from(client);

const createNotesFunction: HandlerType = async (event, userId) => {
  const body = event.body ? JSON.parse(event.body) : {};

  const noteId = `${Date.now()}#note${Math.random().toString(36).slice(2, 8)}`;

  const note = {
    userId,
    noteId,
    ...body,
  };

  await docClient.send(
    new PutCommand({
      TableName: process.env.NOTES_TABLE_NAME,
      Item: note,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Note Created', note }),
  };
};

export const handler = lambdaWrapper(createNotesFunction);
