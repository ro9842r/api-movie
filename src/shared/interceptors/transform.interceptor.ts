import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const response = context.switchToHttp().getResponse<ExpressResponse>();
        return {
          statusCode: response.statusCode,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
