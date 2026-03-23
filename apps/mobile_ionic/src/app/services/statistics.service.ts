import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Statistics {
  totalSessions: number;
  favoriteCount: number;
  questionCount: number;
}

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(private api: ApiService) {}

  get() {
    return this.api.get<{ data: Statistics }>('/v1/statistics');
  }
}
