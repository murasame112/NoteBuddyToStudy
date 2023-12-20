import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-panel-main',
  templateUrl: './admin-panel-main.component.html',
  styleUrls: ['./admin-panel-main.component.scss'],
})
export class AdminPanelMainComponent {
  constructor(public authService: AuthService) {}
}
