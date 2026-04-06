import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface SurveyResponse {
  id: string;
  overallRating: number;
  contentRating: number;
  organizationRating: number;
  venueRating: number;
  wouldRecommend: boolean;
  comments?: string;
  createdAt: string;
}

export interface SurveyPayload {
  overallRating: number;
  contentRating: number;
  organizationRating: number;
  venueRating: number;
  wouldRecommend: boolean;
  comments?: string;
}

@Injectable({ providedIn: 'root' })
export class SurveyService {
  constructor(private api: ApiService) {}

  get() {
    return this.api.get<{ data: SurveyResponse | null }>('/v1/survey');
  }

  submit(payload: SurveyPayload) {
    return this.api.post<{ data: SurveyResponse }>('/v1/survey', payload);
  }
}
