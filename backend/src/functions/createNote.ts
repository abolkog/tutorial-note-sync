import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Note, noteSchema } from '../schema/note';
import { ZodError } from 'zod';
import { dynamodb } from '../utils/dynamo';
import { apiResponse } from '../utils/response';

const createNotesFunction: HandlerType = async (event, userId) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const data = noteSchema.parse(body);

    const noteId = `${Date.now()}#note${Math.random().toString(36).slice(2, 8)}`;

    const note: Note = {
      ...data,
      userId,
      noteId,
      createdAt: new Date().toISOString(),
    };

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.NOTES_TABLE_NAME,
        Item: note,
      })
    );

    return apiResponse.ok({ message: 'Note Created', note });
  } catch (e) {
    if (e instanceof ZodError) {
      return apiResponse.badRequest({ message: 'Error creating note', error: e });
    }
    throw e;
  }
};

export const handler = lambdaWrapper(createNotesFunction);
