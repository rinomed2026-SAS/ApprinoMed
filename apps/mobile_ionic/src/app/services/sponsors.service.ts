import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Sponsor } from './types';

@Injectable({ providedIn: 'root' })
export class SponsorsService {
  constructor(private api: ApiService) {}

  list() {
    return this.api.get<{ data: Sponsor[] }>('/v1/sponsors');
  }

  get(id: string) {
    return this.api.get<{ data: Sponsor }>(`/v1/sponsors/${id}`);
  }

  createLead(id: string, payload?: { userId?: string; requestedAt?: string }) {
    return this.api.post(`/v1/sponsors/${id}/leads`, payload ?? {});
  }
}
