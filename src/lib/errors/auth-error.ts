export class AuthError extends Error {
  constructor() {
    super("Non authentifié");
    this.name = "AuthError";
  }
}