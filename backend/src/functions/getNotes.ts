import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';

const getNotesFunction: HandlerType = async (event, userId) => {
  console.log({ event });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello from Get Notes', userId }),
  };
};

export const handler = lambdaWrapper(getNotesFunction);
