import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';

const deleteNoteFunction: HandlerType = async (event, userId) => {
  console.log({ event });
  const noteId = event.pathParameters?.noteId;

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello from Delete Note', noteId }),
  };
};

export const handler = lambdaWrapper(deleteNoteFunction);
