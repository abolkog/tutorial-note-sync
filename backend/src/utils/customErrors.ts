export class AuthError extends Error {
  public readonly statusCode;

  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
