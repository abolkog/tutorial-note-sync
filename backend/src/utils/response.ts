type LambdaResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const jsonResponse = (statusCode: number, data: unknown): LambdaResponse => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
};

export const apiResponse = {
  ok: (data: unknown) => jsonResponse(200, data),
  created: (data: unknown) => jsonResponse(201, data),
  badRequest: (data: unknown) => jsonResponse(400, data),
  unauthorised: (message = 'You are not authorized to access this resources') => jsonResponse(401, { message }),
  forbidden: (message = 'Forbidden') => jsonResponse(403, { message }),
  notFound: (message = 'Not Found') => jsonResponse(404, { message }),
  serverError: (error?: unknown) =>
    jsonResponse(500, {
      message: 'Internal Server Error',
      error,
    }),
};
