import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Session } from './types';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  constructor(private api: ApiService) {}

  list(day?: string, query?: string) {
    const params = new URLSearchParams();
    if (day) params.append('day', day);
    if (query) params.append('query', query);
    return this.api.get<{ data: Session[] }>(`/v1/sessions?${params.toString()}`);
  }

  get(id: string) {
    return this.api.get<Session & { speakers: any[] }>(`/v1/sessions/${id}`);
  }
}
