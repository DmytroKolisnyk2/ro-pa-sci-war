import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errors = [];
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse.hasOwnProperty('message') &&
      Array.isArray(exceptionResponse['message'])
    ) {
      errors = exceptionResponse['message'];
    } else {
      errors = [exceptionResponse];
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors,
    });
  }
}
