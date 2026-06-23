import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { environment } from '../../../../environments/environment';

interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private http = inject(HttpClient);

  private _currentUser = signal<Usuario | null>(this.restoreFromToken());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem(this.TOKEN_KEY, token);
          this._currentUser.set(user);
        }),
        map(() => undefined),
      );
  }

  register(data: RegisterData): Observable<void> {
    return this.http
      .post<{ user: Usuario }>(`${environment.apiUrl}/auth/register`, data)
      .pipe(map(() => undefined));
  }

  verifyEmail(token: string): Observable<void> {
    return this.http
      .get<void>(`${environment.apiUrl}/auth/verificar`, { params: { token } });
  }

  resendVerification(email: string): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/resend-verification`, { email });
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/reset-password`, { token, password });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Decodifica el JWT del localStorage para restaurar el estado sin hacer un request extra.
  // El JWT no está encriptado — el payload es base64 legible por el cliente.
  private restoreFromToken(): Usuario | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1] ?? '')) as Record<string, unknown>;
      if (typeof payload['exp'] === 'number' && payload['exp'] * 1000 < Date.now()) {
        localStorage.removeItem(this.TOKEN_KEY);
        return null;
      }
      return {
        id: payload['sub'] as number,
        email: payload['email'] as string,
        nombre: payload['nombre'] as string,
        apellido: payload['apellido'] as string,
        direccion: payload['direccion'] as string,
      };
    } catch {
      return null;
    }
  }
}
