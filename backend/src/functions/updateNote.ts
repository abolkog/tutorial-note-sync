import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';

const updateNoteFunction: HandlerType = async (event, userId) => {
  console.log({ event });
  const noteId = event.pathParameters?.noteId;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello from Update Note', noteId }),
  };
};

export const handler = lambdaWrapper(updateNoteFunction);
