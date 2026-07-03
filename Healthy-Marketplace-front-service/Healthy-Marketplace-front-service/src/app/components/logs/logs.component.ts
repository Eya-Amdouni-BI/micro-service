import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogsService, LogEntry } from '../../services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit, OnDestroy {
  logs: LogEntry[] = [];
  status = 'Connecting...';
  private eventSource?: EventSource;

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.logsService.getLogs().subscribe({
      next: (entries) => {
        this.logs = entries;
      },
      error: () => {
        this.status = 'Unable to load logs';
      }
    });
    this.connectStream();
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }

  private connectStream(): void {
    try {
      this.eventSource = this.logsService.connectLogStream();
      this.eventSource.onopen = () => {
        this.status = 'Live updates connected';
      };
      this.eventSource.onmessage = (event) => {
        try {
          const entry = JSON.parse(event.data) as LogEntry;
          this.logs.unshift(entry);
          if (this.logs.length > 250) {
            this.logs.pop();
          }
        } catch {
          // ignore invalid SSE data
        }
      };
      this.eventSource.onerror = () => {
        this.status = 'Connection lost, reconnecting...';
      };
    } catch {
      this.status = 'Failed to connect to live log stream';
    }
  }
}
