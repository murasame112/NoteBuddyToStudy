import { Component, OnInit } from '@angular/core';
import { UserDocService } from 'src/app/services/user-doc.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  constructor(private userDocService: UserDocService) {}

  copyrightYear: number | null = null;

  ngOnInit(): void {
    this.getYear();
  }

  getYear() {
    this.copyrightYear = new Date().getFullYear();
  }

  openUserDoc() {
    const pdfPath = this.userDocService.getUserDocPath();
    const pdfUrl = window.location.origin + pdfPath;
    window.open(pdfUrl, '_blank');
  }
}
