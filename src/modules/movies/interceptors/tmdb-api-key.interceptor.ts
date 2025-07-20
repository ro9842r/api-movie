import { Injectable, Inject } from '@nestjs/common';
import { InternalAxiosRequestConfig } from 'axios';

@Injectable()
export class TmdbApiKeyInterceptor {
  constructor(@Inject('TMDB_API_KEY') private readonly apiKey: string) {}

  addApiKey = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    if (!config.params) {
      config.params = {} as Record<string, any>;
    }

    (config.params as Record<string, any>).api_key = this.apiKey;
    return config;
  };
}
