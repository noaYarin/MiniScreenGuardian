export class AppError extends Error {
  constructor({ status = 400, code = "BAD_REQUEST", message = "Bad request" }) {
    super(message);
    this.status = status;
    this.code = code;
  }
}