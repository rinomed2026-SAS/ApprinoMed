import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { UserProfile } from './types';

const ACCESS_KEY = 'rinomed_access';
const REFRESH_KEY = 'rinomed_refresh';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private api: ApiService, private storage: StorageService) {}

  async getAccessToken() {
    return this.storage.get<string>(ACCESS_KEY);
  }

  async getRefreshToken() {
    return this.storage.get<string>(REFRESH_KEY);
  }

  async setTokens(accessToken: string, refreshToken: string) {
    await this.storage.set(ACCESS_KEY, accessToken);
    await this.storage.set(REFRESH_KEY, refreshToken);
  }

  async clearTokens() {
    await this.storage.remove(ACCESS_KEY);
    await this.storage.remove(REFRESH_KEY);
  }

  login(email: string, password: string) {
    return this.api.post<{ accessToken: string; refreshToken: string; user: UserProfile }>('/v1/auth/login', {
      email,
      password
    });
  }

  register(name: string, email: string, password: string) {
    return this.api.post<{ accessToken: string; refreshToken: string; user: UserProfile }>('/v1/auth/register', {
      name,
      email,
      password
    });
  }

  refresh(refreshToken: string) {
    return this.api.post<{ accessToken: string; refreshToken: string }>('/v1/auth/refresh', { refreshToken });
  }

  logout(refreshToken: string) {
    return this.api.post('/v1/auth/logout', { refreshToken });
  }

  loadProfile() {
    return this.api.get<UserProfile>('/v1/me');
  }

  setUser(user: UserProfile | null) {
    this.userSubject.next(user);
  }

  isAuthenticated() {
    return from(this.getAccessToken());
  }
}
