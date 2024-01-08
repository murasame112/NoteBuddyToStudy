import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-panel-main',
  templateUrl: './admin-panel-main.component.html',
  styleUrls: ['./admin-panel-main.component.scss'],
})
export class AdminPanelMainComponent implements OnInit {
  constructor(public authService: AuthService) {}

  userId: string | undefined = undefined;
  userRole: string | undefined = undefined;

  ngOnInit(): void {
    this.userId = this.authService.currentUserSignal()?._id;
    this.userRole = this.authService.currentUserSignal()?.role;
  }
}
