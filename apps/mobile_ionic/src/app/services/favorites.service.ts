import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Session } from './types';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  constructor(private api: ApiService) {}

  list() {
    return this.api.get<{ data: Session[] }>('/v1/favorites');
  }

  add(sessionId: string) {
    return this.api.post(`/v1/favorites/${sessionId}`);
  }

  remove(sessionId: string) {
    return this.api.delete(`/v1/favorites/${sessionId}`);
  }
}
