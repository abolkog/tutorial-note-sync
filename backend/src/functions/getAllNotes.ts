import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { HandlerType, lambdaWrapper } from '../utils/lambdaWrapper';
import { dynamodb } from '../utils/dynamo';
import { apiResponse } from '../utils/response';

const getAllNotesFunction: HandlerType = async (event, userId) => {
  const lastKeyParam = event.queryStringParameters?.lastKey;
  const limitParam = event.queryStringParameters?.limit;

  const command = new QueryCommand({
    TableName: process.env.NOTES_TABLE_NAME,
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: {
      ':uid': userId,
    },
    ScanIndexForward: false, // descending order by sort key
    Limit: limitParam ? Number(limitParam) : 10,
    ExclusiveStartKey: lastKeyParam ? JSON.parse(decodeURIComponent(lastKeyParam)) : undefined,
  });

  const result = await dynamodb.send(command);

  const lastKey = result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null;
  return apiResponse.ok({ data: result.Items, lastKey });
};

export const handler = lambdaWrapper(getAllNotesFunction);
