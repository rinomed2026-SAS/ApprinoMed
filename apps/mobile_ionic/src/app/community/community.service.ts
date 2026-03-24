import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import {
  CommunityGalleryItem,
  CommunitySubmission,
  CreateCommunitySubmissionPayload,
} from './community.types';

@Injectable({ providedIn: 'root' })
export class CommunityService {
  constructor(private api: ApiService) {}

  /** Obtiene las imágenes aprobadas para la galería pública */
  getGallery(): Observable<{ data: CommunityGalleryItem[] }> {
    return this.api.get<{ data: CommunityGalleryItem[] }>('/v1/community/gallery');
  }

  /** Envía una nueva submission (requiere auth) */
  submit(
    payload: CreateCommunitySubmissionPayload
  ): Observable<{ data: CommunitySubmission }> {
    return this.api.post<{ data: CommunitySubmission }>(
      '/v1/community/submissions',
      payload
    );
  }
}
