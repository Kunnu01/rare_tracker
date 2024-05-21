export class HttpError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not found') {
    super(message, 404)
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad request') {
    super(message, 400)
  }
}
