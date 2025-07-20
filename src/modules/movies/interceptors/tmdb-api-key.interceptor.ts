import { Injectable, Inject } from '@nestjs/common';
import { InternalAxiosRequestConfig } from 'axios';

@Injectable()
export class TmdbApiKeyInterceptor {
  constructor(@Inject('TMDB_API_KEY') private readonly apiKey: string) {}

  addApiKey = (
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig => {
    if (!config.params) {
      config.params = {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.params.api_key = this.apiKey;
    return config;
  };
}
