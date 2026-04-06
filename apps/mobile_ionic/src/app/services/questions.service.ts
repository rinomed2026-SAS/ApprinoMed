import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Question } from './types';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  constructor(private api: ApiService) {}

  list() {
    return this.api.get<{ data: Question[] }>('/v1/questions');
  }

  create(sessionId: string, text: string, anonymous: boolean = false) {
    return this.api.post<{ data: Question }>(`/v1/sessions/${sessionId}/questions`, { text, anonymous });
  }

  remove(questionId: string) {
    return this.api.delete(`/v1/questions/${questionId}`);
  }
}
