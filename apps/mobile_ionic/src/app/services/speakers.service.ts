import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Speaker } from './types';

@Injectable({ providedIn: 'root' })
export class SpeakersService {
  constructor(private api: ApiService) {}

  list(query?: string) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    return this.api.get<{ data: Speaker[] }>(`/v1/speakers?${params.toString()}`);
  }

  get(id: string) {
    return this.api.get<Speaker & { sessions: any[] }>(`/v1/speakers/${id}`);
  }
}
