export class AppError extends Error {
  constructor(code, message, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_ENDED: 'SESSION_ENDED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  MSG_TOO_LONG: 'MSG_TOO_LONG',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RECORDING_ERROR: 'RECORDING_ERROR',
};

export default AppError;