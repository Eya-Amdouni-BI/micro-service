import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getLogs(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(`${this.baseUrl}/logs`);
  }

  connectLogStream(): EventSource {
    return new EventSource(`${this.baseUrl}/logs/stream`);
  }
}
