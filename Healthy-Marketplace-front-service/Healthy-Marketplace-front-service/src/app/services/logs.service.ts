import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface LogEntry {
  timestamp: string;
  service: string;
  level: string;
  message: string;
  meta?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class LogsService {
  private readonly baseUrl = 'http://localhost:8090';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getLogs(): Observable<LogEntry[]> {
    return from(this.authService.getToken()).pipe(
      switchMap((token) =>
        this.http.get<LogEntry[]>(`${this.baseUrl}/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    );
  }

  async connectLogStream(): Promise<EventSource> {
    const token = await this.authService.getToken();
    return new EventSource(`${this.baseUrl}/logs/stream?access_token=${encodeURIComponent(token)}`);
  }
}
