import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Injectable({ scope: Scope.REQUEST })
export class UserContext {
  constructor(
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  get currentUserId(): string {
    return this.request.user?.id;
  }

  get currentUser() {
    return this.request.user;
  }
}
