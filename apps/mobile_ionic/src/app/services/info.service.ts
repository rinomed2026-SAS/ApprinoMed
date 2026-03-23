import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EventInfo, Hotel, Tourism } from './types';

@Injectable({ providedIn: 'root' })
export class InfoService {
  constructor(private api: ApiService) {}

  eventInfo() {
    return this.api.get<{ data: EventInfo }>('/v1/event-info');
  }

  hotels() {
    return this.api.get<{ data: Hotel[] }>('/v1/hotels');
  }

  tourism() {
    return this.api.get<{ data: Tourism[] }>('/v1/tourism');
  }
}
