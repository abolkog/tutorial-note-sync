import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { AuthError } from './customErrors';

type JwtClaims = {
  sub?: string;
};

type HttpApiAuthContext = {
  authorizer?: {
    jwt?: {
      claims?: JwtClaims;
    };
  };
};

export const verifyUserId = (event: APIGatewayProxyEventV2): string => {
  const context = event.requestContext as HttpApiAuthContext;
  const userId = context.authorizer?.jwt?.claims?.sub;

  if (!userId) {
    throw new AuthError('UserId not found');
  }

  return userId;
};
