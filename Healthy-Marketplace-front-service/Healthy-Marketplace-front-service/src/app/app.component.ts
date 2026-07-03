import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'healthy-marketplace-front';
  isAdmin : boolean = false;
  constructor(private readonly authService :AuthService) {
    
  }
  async ngOnInit(): Promise<void> {

    this.isAdmin = await this.authService.isAdmin();
  }
}
